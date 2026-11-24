from typing import List, Optional

from sqlalchemy.orm import Session

from controllers import document_rules, record_exit
from core.errors import bad_request, conflict, not_found
from models.document import DocumentStageEnum
from models.internship import (
    INTERNSHIP_EXITS, INTERNSHIP_IN_COURSE, ApplicationStatusEnum, Internship, InternshipApplication, InternshipStatusEnum,
)
from models.promotion import ProgramEnum
from models.user import User
from repos.internship import InternshipApplicationRepo, InternshipRepo
from repos.promotion import PromotionRepo, PromotionSiteDetailRepo
from repos.site import SiteRepo
from repos.user import UserRepo
from schemas.internship import InternshipApplicationInput, InternshipUpdate


def _scope_academic_id(user: User, academic_id: Optional[str]) -> Optional[str]:
    """Un estudiante solo puede consultar sus propios datos."""
    return academic_id if user.is_staff else user.academic_id


# ---------------------- INTERNSHIP APPLICATION ----------------------

def list_applications(
    db: Session, user: User,
    promotion_id: Optional[int], academic_id: Optional[str], status: Optional[ApplicationStatusEnum],
) -> List[InternshipApplication]:
    applications = InternshipApplicationRepo(db).list(
        promotion_id=promotion_id, academic_id=_scope_academic_id(user, academic_id), status=status,
    )
    return document_rules.attach_inscription_progress(db, ProgramEnum.INTERNSHIP, applications)


def get_application(db: Session, user: User, application_id: int) -> InternshipApplication:
    application = InternshipApplicationRepo(db).get(application_id)
    if application is None or (not user.is_staff and application.academic_id != user.academic_id):
        raise not_found("Asignación no encontrada.")
    return application


def get_application_detail(db: Session, user: User, application_id: int) -> InternshipApplication:
    """Como get_application, con el avance del expediente de inscripción."""
    application = get_application(db, user, application_id)
    document_rules.attach_inscription_progress(db, ProgramEnum.INTERNSHIP, [application])
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
    internships = InternshipRepo(db).list(academic_id=data.academic_id)
    if any(i.status == InternshipStatusEnum.FINISHED for i in internships):
        raise conflict("El estudiante ya acreditó el internado.")
    if any(i.status in INTERNSHIP_IN_COURSE for i in internships):
        raise conflict("El estudiante ya tiene un internado en curso.")

    existing = repo.get_by_promotion_student(data.promotion_id, data.academic_id, include_inactive=True)
    if existing and existing.is_active:
        raise conflict("El estudiante ya tiene una asignación en esta promoción.")
    if existing:
        return repo.update(existing, {"status": ApplicationStatusEnum.PENDING, "is_active": True, "average": data.average})
    return repo.add(InternshipApplication(promotion_id=data.promotion_id, academic_id=data.academic_id, average=data.average))


def _ensure_pending(application: InternshipApplication) -> None:
    if application.status != ApplicationStatusEnum.PENDING:
        raise conflict("Esta asignación ya fue respondida.")
    if application.promotion.is_finished:
        raise conflict("La promoción ya está finalizada.")


def accept_application(db: Session, user: User, application_id: int) -> Internship:
    """Acepta la asignación (con los documentos obligatorios de inscripción ya subidos) y crea el internado."""
    application = get_application(db, user, application_id)
    _ensure_pending(application)
    if any(i.status in INTERNSHIP_IN_COURSE for i in InternshipRepo(db).list(academic_id=application.academic_id)):
        raise conflict("Ya tienes un internado en curso en otra promoción.")
    document_rules.ensure_inscription_submitted(db, ProgramEnum.INTERNSHIP, application.application_id)
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
    """
    La coordinación registra la sede que eligió el estudiante (respetando el cupo de la promoción)
    o cambia el estatus. Registrar la primera sede exige el expediente de inscripción completo y
    finalizar el internado, los documentos obligatorios de las etapas durante y término aprobados.
    La renuncia y la baja llevan fecha y motivo y liberan el lugar (ver record_exit).
    """
    internship = get_internship(db, user, internship_id)
    payload = data.model_dump(exclude_unset=True)
    target_site = payload.get("site_id", internship.site_id)
    target_status = payload.get("status", internship.status)
    record_exit.apply_exit(
        internship, payload, INTERNSHIP_EXITS, InternshipStatusEnum.FINISHED,
        "El internado ya está finalizado: no se puede registrar renuncia ni baja.",
    )
    if internship.status in INTERNSHIP_EXITS and target_status in INTERNSHIP_IN_COURSE:
        record_exit.ensure_no_other_record([
            other for other in InternshipRepo(db).list(academic_id=internship.academic_id)
            if other.internship_id != internship.internship_id and other.status not in INTERNSHIP_EXITS
        ], "internado")

    if internship.site_id is None and target_site is not None:
        document_rules.ensure_stages_complete(
            db, ProgramEnum.INTERNSHIP, internship.application_id, [DocumentStageEnum.INSCRIPTION],
            "Antes de registrar la sede deben estar aprobados los documentos obligatorios de inscripción.",
        )
    if target_status == InternshipStatusEnum.FINISHED and internship.status != InternshipStatusEnum.FINISHED:
        document_rules.ensure_stages_complete(
            db, ProgramEnum.INTERNSHIP, internship.application_id, document_rules.CLOSING_STAGES,
            "Para finalizar el internado deben estar aprobados los documentos obligatorios del internado.",
        )
    takes_seat = target_site is not None and target_status in INTERNSHIP_IN_COURSE
    seat_changed = target_site != internship.site_id or internship.status not in INTERNSHIP_IN_COURSE

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
    """
    Elimina el internado (p. ej. si se aceptó por error) y regresa la asignación a pendiente. Solo si
    está en curso: uno finalizado (acreditado) o con renuncia o baja es historial; se corrige su estatus.
    """
    internship = get_internship(db, user, internship_id)
    if internship.status not in INTERNSHIP_IN_COURSE:
        raise conflict("Este internado ya terminó (finalizado, renuncia o baja) y no se puede eliminar; si fue un error, cambia su estatus.")
    internship.is_active = False
    internship.application.status = ApplicationStatusEnum.PENDING
    db.commit()

