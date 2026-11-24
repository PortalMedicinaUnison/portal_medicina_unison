from typing import List, Optional, Tuple
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, not_found
from models.internship import (
    ApplicationStatusEnum, DocumentTypeEnum, Internship, InternshipApplication,
    InternshipDocument, InternshipStatusEnum,
)
from models.promotion import ProgramEnum
from models.user import User
from repos.internship import InternshipApplicationRepo, InternshipDocumentRepo, InternshipRepo
from repos.promotion import PromotionRepo, PromotionSiteDetailRepo
from repos.site import SiteRepo
from repos.user import UserRepo
from schemas.internship import InternshipApplicationInput, InternshipUpdate
from utils.file_handlers import resolve_upload, save_pdf_upload
from core.settings import settings


def _scope_academic_id(user: User, academic_id: Optional[str]) -> Optional[str]:
    """Un estudiante solo puede consultar sus propios datos."""
    return academic_id if user.is_staff else user.academic_id


# ---------------------- INTERNSHIP APPLICATION ----------------------

def list_applications(
    db: Session, user: User,
    promotion_id: Optional[int], academic_id: Optional[str], status: Optional[ApplicationStatusEnum],
) -> List[InternshipApplication]:
    return InternshipApplicationRepo(db).list(
        promotion_id=promotion_id, academic_id=_scope_academic_id(user, academic_id), status=status,
    )


def get_application(db: Session, user: User, application_id: int) -> InternshipApplication:
    application = InternshipApplicationRepo(db).get(application_id)
    if application is None or (not user.is_staff and application.academic_id != user.academic_id):
        raise not_found("Asignación no encontrada.")
    return application


def create_application(db: Session, data: InternshipApplicationInput) -> InternshipApplication:
    repo = InternshipApplicationRepo(db)
    student = UserRepo(db).get_by_academic_id(data.academic_id)
    if student is None or student.is_staff:
        raise bad_request("No hay un estudiante registrado con ese expediente.")
    promotion = PromotionRepo(db).get(data.promotion_id)
    if promotion is None:
        raise bad_request("La promoción seleccionada no existe.")
    if promotion.program != ProgramEnum.INTERNSHIP:
        raise bad_request("La promoción seleccionada no es de internado.")
    if promotion.is_finished:
        raise conflict("La promoción ya está finalizada.")
    current = [
        app for app in repo.list(academic_id=data.academic_id, status=ApplicationStatusEnum.ACCEPTED)
        if app.internship is not None and app.internship.status != InternshipStatusEnum.FINISHED
    ]
    if current:
        raise conflict("El estudiante ya tiene un internado en curso.")

    existing = repo.get_by_promotion_student(data.promotion_id, data.academic_id, include_inactive=True)
    if existing and existing.is_active:
        raise conflict("El estudiante ya tiene una asignación en esta promoción.")
    if existing:
        return repo.update(existing, {"status": ApplicationStatusEnum.PENDING, "is_active": True})
    return repo.add(InternshipApplication(promotion_id=data.promotion_id, academic_id=data.academic_id))


def _ensure_pending(application: InternshipApplication) -> None:
    if application.status != ApplicationStatusEnum.PENDING:
        raise conflict("Esta asignación ya fue respondida.")
    if application.promotion.is_finished:
        raise conflict("La promoción ya está finalizada.")


def accept_application(db: Session, user: User, application_id: int) -> Internship:
    """Acepta la asignación y crea el internado en la misma transacción."""
    application = get_application(db, user, application_id)
    _ensure_pending(application)
    application.status = ApplicationStatusEnum.ACCEPTED

    internship = InternshipRepo(db).get_by_application_any(application.application_id)
    if internship is None:
        internship = Internship(application_id=application.application_id, status=InternshipStatusEnum.ACTIVE)
        db.add(internship)
    else:
        internship.is_active = True
        internship.status = InternshipStatusEnum.ACTIVE
        internship.site_id = None
    db.commit()
    db.refresh(internship)
    return internship


def decline_application(db: Session, user: User, application_id: int) -> InternshipApplication:
    application = get_application(db, user, application_id)
    _ensure_pending(application)
    return InternshipApplicationRepo(db).update(application, {"status": ApplicationStatusEnum.DECLINED})


def delete_application(db: Session, application_id: int) -> None:
    repo = InternshipApplicationRepo(db)
    application = repo.get(application_id)
    if application is None:
        raise not_found("Asignación no encontrada.")
    if InternshipRepo(db).get_by_application(application_id):
        raise conflict("La asignación tiene un internado; elimina primero el internado.")
    repo.soft_delete(application)


# ---------------------- INTERNSHIP ----------------------

def list_internships(
    db: Session, user: User,
    promotion_id: Optional[int], site_id: Optional[int], academic_id: Optional[str],
    status: Optional[InternshipStatusEnum],
) -> List[Internship]:
    return InternshipRepo(db).list(
        promotion_id=promotion_id, site_id=site_id,
        academic_id=_scope_academic_id(user, academic_id), status=status,
    )


def get_internship(db: Session, user: User, internship_id: int) -> Internship:
    internship = InternshipRepo(db).get(internship_id)
    if internship is None or (not user.is_staff and internship.academic_id != user.academic_id):
        raise not_found("Internado no encontrado.")
    return internship


def update_internship(db: Session, user: User, internship_id: int, data: InternshipUpdate) -> Internship:
    """El administrador asigna la sede (respetando el cupo de la promoción) o cambia el estatus."""
    internship = get_internship(db, user, internship_id)
    payload = data.model_dump(exclude_unset=True)
    target_site = payload.get("site_id", internship.site_id)
    target_status = payload.get("status", internship.status)
    takes_seat = target_site is not None and target_status != InternshipStatusEnum.FINISHED
    seat_changed = target_site != internship.site_id or (
        internship.status == InternshipStatusEnum.FINISHED and target_status != InternshipStatusEnum.FINISHED
    )

    if takes_seat and seat_changed:
        if SiteRepo(db).get(target_site) is None:
            raise bad_request("La sede seleccionada no existe.")
        psd = PromotionSiteDetailRepo(db).get_by_promotion_site(internship.promotion_id, target_site)
        if psd is None:
            raise bad_request("La sede no tiene cupo en la promoción de este internado.")
        occupied = InternshipRepo(db).count_in_site(internship.promotion_id, target_site, exclude_internship_id=internship.internship_id)
        if occupied >= psd.capacity:
            raise conflict(f"La sede ya no tiene cupo disponible ({occupied}/{psd.capacity}).")
    return InternshipRepo(db).update(internship, payload)


def delete_internship(db: Session, user: User, internship_id: int) -> None:
    """Da de baja el internado y regresa la asignación a pendiente."""
    internship = get_internship(db, user, internship_id)
    internship.is_active = False
    internship.application.status = ApplicationStatusEnum.PENDING
    db.commit()


# ---------------------- INTERNSHIP DOCUMENT ----------------------

def list_documents(db: Session, user: User, internship_id: int) -> List[InternshipDocument]:
    get_internship(db, user, internship_id)
    return InternshipDocumentRepo(db).list(internship_id)


def get_document(db: Session, user: User, internship_id: int, document_id: int) -> InternshipDocument:
    get_internship(db, user, internship_id)
    document = InternshipDocumentRepo(db).get_for_internship(internship_id, document_id)
    if document is None:
        raise not_found("Documento no encontrado.")
    return document


def upload_document(
    db: Session, user: User, internship_id: int, document_type: DocumentTypeEnum, file: UploadFile,
) -> InternshipDocument:
    get_internship(db, user, internship_id)
    repo = InternshipDocumentRepo(db)
    if repo.get_active_by_type(internship_id, document_type):
        raise conflict("Ya hay un documento de este tipo; elimínalo para subir uno nuevo.")

    relative_path, original_name = save_pdf_upload(file, f"internship-documents/{internship_id}")
    document = InternshipDocument(
        internship_id=internship_id,
        document_type=document_type,
        path=relative_path,
        media_type="application/pdf",
        original_filename=original_name,
    )
    try:
        return repo.add(document)
    except IntegrityError:
        db.rollback()
        (settings.UPLOAD_DIR / relative_path).unlink(missing_ok=True)
        raise conflict("Ya hay un documento de este tipo; elimínalo para subir uno nuevo.")


def get_document_file(db: Session, user: User, internship_id: int, document_id: int) -> Tuple[Path, InternshipDocument]:
    document = get_document(db, user, internship_id, document_id)
    return resolve_upload(document.path), document


def delete_document(db: Session, user: User, internship_id: int, document_id: int) -> None:
    document = get_document(db, user, internship_id, document_id)
    InternshipDocumentRepo(db).soft_delete(document)
