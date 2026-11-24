"""
Expediente de cada asignación (internado o servicio social). Cada documento del catálogo dice
quién lo sube (provided_by):
- Los del alumno: los sube el estudiante y la coordinación los revisa (aprobado o con observaciones).
- Los de la coordinación (p. ej. la constancia de culminación que emite la institución de salud):
  solo los sube la coordinación y quedan aprobados; el estudiante los consulta.

Reglas para el estudiante:
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
from core.errors import bad_request, conflict, forbidden, not_found
from models.base import utcnow
from models.document import (
    ApplicationDocument, DocumentProviderEnum, DocumentRequirement, DocumentStageEnum, ReviewStatusEnum,
)
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


def _program_record(program: ProgramEnum, application: Application):
    """Internado o servicio social de la asignación (None si aún no la acepta)."""
    return application.internship if program == ProgramEnum.INTERNSHIP else application.social_service


def _ensure_can_upload(user: User, requirement: DocumentRequirement) -> None:
    by_coordination = requirement.provided_by == DocumentProviderEnum.COORDINATION
    if user.is_staff and not by_coordination:
        raise forbidden("Este documento lo sube el alumno; la coordinación puede aprobarlo o ponerle observaciones.")
    if not user.is_staff and by_coordination:
        raise forbidden("Este documento lo sube la coordinación.")


def _ensure_student_can_edit(program: ProgramEnum, application: Application, requirement: DocumentRequirement) -> None:
    if application.status == ApplicationStatusEnum.DECLINED:
        raise conflict("Declinaste esta asignación: ya no puedes modificar sus documentos.")
    if application.promotion.is_finished:
        raise conflict("La promoción ya terminó: ya no se pueden modificar sus documentos.")
    if program == ProgramEnum.INTERNSHIP:
        record, finished, closed_message = (
            application.internship, InternshipStatusEnum.FINISHED, "Tu internado ya está finalizado: ya no se pueden modificar sus documentos.",
        )
    else:
        record, finished, closed_message = (
            application.social_service, SocialServiceStatusEnum.FINISHED, "Tu servicio social ya está liberado: ya no se pueden modificar sus documentos.",
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
    anterior (que se conserva como histórico). Lo que sube el alumno queda en revisión; lo que sube
    la coordinación, aprobado.
    """
    application = get_application(db, user, program, application_id)
    requirement = DocumentRequirementRepo(db).get(requirement_id)
    if requirement is None or requirement.program != program:
        raise bad_request("El documento seleccionado no está en el catálogo de este programa.")
    _ensure_can_upload(user, requirement)
    if not user.is_staff:
        _ensure_student_can_edit(program, application, requirement)
    elif requirement.stage != DocumentStageEnum.INSCRIPTION and _program_record(program, application) is None:
        raise conflict("El alumno aún no acepta su asignación.")

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
    review = (
        {"review_status": ReviewStatusEnum.APPROVED, "reviewed_at": utcnow(), "reviewed_by_id": user.user_id}
        if user.is_staff else {"review_status": ReviewStatusEnum.PENDING}
    )
    document = ApplicationDocument(
        requirement_id=requirement.requirement_id,
        path=path,
        media_type="application/pdf",
        original_filename=original_name,
        uploaded_by_id=user.user_id,
        **review,
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
    by_coordination = document.requirement.provided_by == DocumentProviderEnum.COORDINATION
    if user.is_staff and not by_coordination:
        raise forbidden("Los documentos del alumno no se eliminan; ponle observaciones para que suba otro.")
    if not user.is_staff:
        if by_coordination:
            raise forbidden("Este documento lo sube la coordinación.")
        if document.review_status == ReviewStatusEnum.APPROVED:
            raise conflict("No puedes eliminar un documento aprobado.")
        _ensure_student_can_edit(program, application, document.requirement)
    ApplicationDocumentRepo(db).soft_delete(document)


# ---------------------- REVISIÓN (coordinación) ----------------------

def review_document(
    db: Session, reviewer: User, program: ProgramEnum, application_id: int, document_id: int, data: DocumentReviewInput,
) -> ApplicationDocument:
    """Aprueba, marca con observaciones o regresa a revisión un documento del alumno."""
    _application, document = _get_document(db, reviewer, program, application_id, document_id)
    if document.requirement.provided_by == DocumentProviderEnum.COORDINATION:
        raise conflict("Los documentos que sube la coordinación no se revisan.")
    if data.review_status == ReviewStatusEnum.PENDING:
        payload = {"review_status": ReviewStatusEnum.PENDING, "review_comment": None, "reviewed_at": None, "reviewed_by_id": None}
    else:
        payload = {
            "review_status": data.review_status, "review_comment": data.review_comment,
            "reviewed_at": utcnow(), "reviewed_by_id": reviewer.user_id,
        }
    return ApplicationDocumentRepo(db).update(document, payload)
