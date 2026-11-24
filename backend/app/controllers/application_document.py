"""
Expediente de cada asignación (internado o servicio social): el estudiante sube los documentos
del catálogo y la coordinación los revisa (aprobado o con observaciones).

Reglas para el estudiante (la coordinación puede corregir cualquier expediente):
- Inscripción: desde que tiene la asignación (pendiente o aceptada).
- Durante y término: cuando ya aceptó (existe su internado o servicio social).
- No puede cambiar ni borrar documentos aprobados.
- El expediente se cierra si declinó, si la promoción terminó o si el programa se finalizó/liberó.
"""
from pathlib import Path
from typing import List, Tuple, Union

from fastapi import UploadFile
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from controllers import internship as internship_controller
from controllers import social_service as social_service_controller
from core.errors import bad_request, conflict, not_found
from models.base import utcnow
from models.document import ApplicationDocument, DocumentRequirement, DocumentStageEnum, ReviewStatusEnum
from models.internship import ApplicationStatusEnum, InternshipApplication, InternshipStatusEnum
from models.promotion import ProgramEnum
from models.social_service import SocialServiceApplication, SocialServiceStatusEnum
from models.user import User
from repos.document import ApplicationDocumentRepo, DocumentRequirementRepo, application_column
from schemas.document import DocumentReviewInput
from utils.file_handlers import delete_upload, resolve_upload, save_pdf_upload

Application = Union[InternshipApplication, SocialServiceApplication]

# Tope de archivos por requisito que admite varios (bitácoras, reportes, constancias de cursos).
MAX_FILES_PER_REQUIREMENT = 20
UPLOAD_DIRS = {ProgramEnum.INTERNSHIP: "internship", ProgramEnum.SOCIAL_SERVICE: "social-service"}


def get_application(db: Session, user: User, program: ProgramEnum, application_id: int) -> Application:
    """La asignación, si el usuario puede verla (su dueño o la coordinación)."""
    if program == ProgramEnum.INTERNSHIP:
        return internship_controller.get_application(db, user, application_id)
    return social_service_controller.get_application(db, user, application_id)


def _ensure_student_can_edit(program: ProgramEnum, application: Application, requirement: DocumentRequirement) -> None:
    if application.status == ApplicationStatusEnum.DECLINED:
        raise conflict("Declinaste esta asignación: su expediente ya no se puede modificar.")
    if application.promotion.is_finished:
        raise conflict("La promoción ya terminó: el expediente está cerrado.")
    if program == ProgramEnum.INTERNSHIP:
        record, finished, closed_message = (
            application.internship, InternshipStatusEnum.FINISHED, "Tu internado ya está finalizado: el expediente está cerrado.",
        )
    else:
        record, finished, closed_message = (
            application.social_service, SocialServiceStatusEnum.FINISHED, "Tu servicio social ya está liberado: el expediente está cerrado.",
        )
    if requirement.stage != DocumentStageEnum.INSCRIPTION and record is None:
        raise conflict("Podrás subir este documento cuando aceptes tu asignación.")
    if record is not None and record.status == finished:
        raise conflict(closed_message)


# ---------------------- CONSULTA ----------------------

def list_documents(db: Session, user: User, program: ProgramEnum, application_id: int) -> List[ApplicationDocument]:
    get_application(db, user, program, application_id)
    return ApplicationDocumentRepo(db).list_for_application(program, application_id)


def _get_document(
    db: Session, user: User, program: ProgramEnum, application_id: int, document_id: int,
) -> Tuple[Application, ApplicationDocument]:
    application = get_application(db, user, program, application_id)
    document = ApplicationDocumentRepo(db).get_for_application(program, application_id, document_id)
    if document is None:
        raise not_found("Documento no encontrado.")
    return application, document


def get_document_file(
    db: Session, user: User, program: ProgramEnum, application_id: int, document_id: int,
) -> Tuple[Path, ApplicationDocument]:
    _application, document = _get_document(db, user, program, application_id, document_id)
    return resolve_upload(document.path), document


# ---------------------- SUBIR Y ELIMINAR ----------------------

def upload_document(
    db: Session, user: User, program: ProgramEnum, application_id: int, requirement_id: int, file: UploadFile,
) -> ApplicationDocument:
    """
    Sube un PDF para un requisito. Si el requisito admite un solo archivo, el nuevo reemplaza al
    anterior (que se conserva como histórico). Todo archivo nuevo queda en revisión.
    """
    application = get_application(db, user, program, application_id)
    requirement = DocumentRequirementRepo(db).get(requirement_id)
    if requirement is None or requirement.program != program:
        raise bad_request("El documento seleccionado no está en el catálogo de este programa.")
    if not user.is_staff:
        _ensure_student_can_edit(program, application, requirement)

    repo = ApplicationDocumentRepo(db)
    existing = repo.list_for_requirement(program, application_id, requirement_id)
    if requirement.allows_multiple:
        if len(existing) >= MAX_FILES_PER_REQUIREMENT:
            raise conflict(f"Ya hay {MAX_FILES_PER_REQUIREMENT} archivos para este documento; elimina alguno para subir otro.")
        replaced = []
    else:
        if not user.is_staff and any(doc.review_status == ReviewStatusEnum.APPROVED for doc in existing):
            raise conflict("Este documento ya fue aprobado. Si necesitas cambiarlo, pide a la coordinación que lo regrese a revisión.")
        replaced = existing

    path, original_name = save_pdf_upload(file, f"application-documents/{UPLOAD_DIRS[program]}/{application_id}")
    for old in replaced:
        old.is_active = False
    document = ApplicationDocument(
        requirement_id=requirement.requirement_id,
        path=path,
        media_type="application/pdf",
        original_filename=original_name,
        review_status=ReviewStatusEnum.PENDING,
        uploaded_by_id=user.user_id,
        **{application_column(program).key: application_id},
    )
    db.add(document)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        delete_upload(path)
        raise conflict("No se pudo guardar el documento; intenta de nuevo.")
    db.refresh(document)
    return document


def delete_document(db: Session, user: User, program: ProgramEnum, application_id: int, document_id: int) -> None:
    application, document = _get_document(db, user, program, application_id, document_id)
    if not user.is_staff:
        if document.review_status == ReviewStatusEnum.APPROVED:
            raise conflict("No puedes eliminar un documento aprobado.")
        _ensure_student_can_edit(program, application, document.requirement)
    ApplicationDocumentRepo(db).soft_delete(document)


# ---------------------- REVISIÓN (coordinación) ----------------------

def review_document(
    db: Session, reviewer: User, program: ProgramEnum, application_id: int, document_id: int, data: DocumentReviewInput,
) -> ApplicationDocument:
    """Aprueba, marca con observaciones o regresa a revisión un documento."""
    _application, document = _get_document(db, reviewer, program, application_id, document_id)
    if data.review_status == ReviewStatusEnum.PENDING:
        payload = {"review_status": ReviewStatusEnum.PENDING, "review_comment": None, "reviewed_at": None, "reviewed_by_id": None}
    else:
        payload = {
            "review_status": data.review_status, "review_comment": data.review_comment,
            "reviewed_at": utcnow(), "reviewed_by_id": reviewer.user_id,
        }
    return ApplicationDocumentRepo(db).update(document, payload)
