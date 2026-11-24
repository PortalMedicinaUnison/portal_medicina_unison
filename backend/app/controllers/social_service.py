"""
Servicio social: mismo flujo que el internado (asignación → aceptación → plaza → documentos),
pero solo para estudiantes que ya acreditaron (finalizaron) el internado.
"""
from typing import List, Optional

from sqlalchemy.orm import Session

from controllers import document_rules
from core.errors import bad_request, conflict, not_found
from models.document import DocumentStageEnum
from models.internship import ApplicationStatusEnum, InternshipStatusEnum
from models.promotion import ProgramEnum
from models.social_service import SocialService, SocialServiceApplication, SocialServiceStatusEnum
from models.user import User
from repos.internship import InternshipRepo
from repos.promotion import PromotionRepo, PromotionSiteDetailRepo
from repos.site import SiteRepo
from repos.social_service import SocialServiceApplicationRepo, SocialServiceRepo
from repos.user import UserRepo
from schemas.social_service import SocialServiceApplicationInput, SocialServiceUpdate


def _scope_academic_id(user: User, academic_id: Optional[str]) -> Optional[str]:
    """Un estudiante solo puede consultar sus propios datos."""
    return academic_id if user.is_staff else user.academic_id


def has_accredited_internship(db: Session, academic_id: str) -> bool:
    return bool(InternshipRepo(db).list(academic_id=academic_id, status=InternshipStatusEnum.FINISHED))


# ---------------------- SOCIAL SERVICE APPLICATION ----------------------

def list_applications(
    db: Session, user: User,
    promotion_id: Optional[int], academic_id: Optional[str], status: Optional[ApplicationStatusEnum],
) -> List[SocialServiceApplication]:
    applications = SocialServiceApplicationRepo(db).list(
        promotion_id=promotion_id, academic_id=_scope_academic_id(user, academic_id), status=status,
    )
    return document_rules.attach_inscription_progress(db, ProgramEnum.SOCIAL_SERVICE, applications)


def get_application(db: Session, user: User, application_id: int) -> SocialServiceApplication:
    application = SocialServiceApplicationRepo(db).get(application_id)
    if application is None or (not user.is_staff and application.academic_id != user.academic_id):
        raise not_found("Asignación de servicio social no encontrada.")
    return application


def get_application_detail(db: Session, user: User, application_id: int) -> SocialServiceApplication:
    """Como get_application, con el avance del expediente de inscripción."""
    application = get_application(db, user, application_id)
    document_rules.attach_inscription_progress(db, ProgramEnum.SOCIAL_SERVICE, [application])
    return application


def create_application(db: Session, data: SocialServiceApplicationInput) -> SocialServiceApplication:
    repo = SocialServiceApplicationRepo(db)
    student = UserRepo(db).get_by_academic_id(data.academic_id)
    if student is None or student.is_staff:
        raise bad_request("No hay un estudiante registrado con ese expediente.")
    promotion = PromotionRepo(db).get(data.promotion_id)
    if promotion is None:
        raise bad_request("La promoción seleccionada no existe.")
    if promotion.program != ProgramEnum.SOCIAL_SERVICE:
        raise bad_request("La promoción seleccionada no es de servicio social.")
    if promotion.is_finished:
        raise conflict("La promoción ya está finalizada.")
    if not has_accredited_internship(db, data.academic_id):
        raise conflict("El estudiante debe acreditar el internado antes de asignarle servicio social.")
    in_progress = [
        service for service in SocialServiceRepo(db).list(academic_id=data.academic_id)
        if service.status != SocialServiceStatusEnum.FINISHED
    ]
    if in_progress:
        raise conflict("El estudiante ya tiene un servicio social en curso.")

    existing = repo.get_by_promotion_student(data.promotion_id, data.academic_id, include_inactive=True)
    if existing and existing.is_active:
        raise conflict("El estudiante ya tiene una asignación en esta promoción.")
    if existing:
        return repo.update(existing, {"status": ApplicationStatusEnum.PENDING, "is_active": True})
    return repo.add(SocialServiceApplication(promotion_id=data.promotion_id, academic_id=data.academic_id))


def _ensure_pending(application: SocialServiceApplication) -> None:
    if application.status != ApplicationStatusEnum.PENDING:
        raise conflict("Esta asignación ya fue respondida.")
    if application.promotion.is_finished:
        raise conflict("La promoción ya está finalizada.")


def accept_application(db: Session, user: User, application_id: int) -> SocialService:
    """Acepta la asignación y crea el servicio social en la misma transacción."""
    application = get_application(db, user, application_id)
    _ensure_pending(application)
    application.status = ApplicationStatusEnum.ACCEPTED

    service = SocialServiceRepo(db).get_by_application_any(application.application_id)
    if service is None:
        service = SocialService(application_id=application.application_id, status=SocialServiceStatusEnum.ACTIVE)
        db.add(service)
    else:
        service.is_active = True
        service.status = SocialServiceStatusEnum.ACTIVE
        service.site_id = None
    db.commit()
    db.refresh(service)
    return service


def decline_application(db: Session, user: User, application_id: int) -> SocialServiceApplication:
    application = get_application(db, user, application_id)
    _ensure_pending(application)
    return SocialServiceApplicationRepo(db).update(application, {"status": ApplicationStatusEnum.DECLINED})


def delete_application(db: Session, application_id: int) -> None:
    repo = SocialServiceApplicationRepo(db)
    application = repo.get(application_id)
    if application is None:
        raise not_found("Asignación de servicio social no encontrada.")
    if SocialServiceRepo(db).get_by_application(application_id):
        raise conflict("La asignación tiene un servicio social; elimina primero el servicio social.")
    repo.soft_delete(application)


# ---------------------- SOCIAL SERVICE ----------------------

def list_social_services(
    db: Session, user: User,
    promotion_id: Optional[int], site_id: Optional[int], academic_id: Optional[str],
    status: Optional[SocialServiceStatusEnum],
) -> List[SocialService]:
    return SocialServiceRepo(db).list(
        promotion_id=promotion_id, site_id=site_id,
        academic_id=_scope_academic_id(user, academic_id), status=status,
    )


def get_social_service(db: Session, user: User, social_service_id: int) -> SocialService:
    service = SocialServiceRepo(db).get(social_service_id)
    if service is None or (not user.is_staff and service.academic_id != user.academic_id):
        raise not_found("Servicio social no encontrado.")
    return service


def update_social_service(db: Session, user: User, social_service_id: int, data: SocialServiceUpdate) -> SocialService:
    """
    La coordinación registra la plaza que eligió el estudiante (respetando el cupo de la promoción)
    o cambia el estatus. Registrar la primera plaza exige el expediente de inscripción completo y
    liberar el servicio social, los documentos obligatorios de las etapas durante y liberación aprobados.
    """
    service = get_social_service(db, user, social_service_id)
    payload = data.model_dump(exclude_unset=True)
    target_site = payload.get("site_id", service.site_id)
    target_status = payload.get("status", service.status)

    if service.site_id is None and target_site is not None:
        document_rules.ensure_stages_complete(
            db, ProgramEnum.SOCIAL_SERVICE, service.application_id, [DocumentStageEnum.INSCRIPTION],
            "Antes de registrar la plaza, el expediente de inscripción debe estar completo.",
        )
    if target_status == SocialServiceStatusEnum.FINISHED and service.status != SocialServiceStatusEnum.FINISHED:
        document_rules.ensure_stages_complete(
            db, ProgramEnum.SOCIAL_SERVICE, service.application_id, document_rules.CLOSING_STAGES,
            "Para liberar el servicio social deben estar aprobados los documentos obligatorios del servicio social.",
        )
    takes_seat = target_site is not None and target_status != SocialServiceStatusEnum.FINISHED
    seat_changed = target_site != service.site_id or (
        service.status == SocialServiceStatusEnum.FINISHED and target_status != SocialServiceStatusEnum.FINISHED
    )

    if takes_seat and seat_changed:
        if SiteRepo(db).get(target_site) is None:
            raise bad_request("La sede seleccionada no existe.")
        psd = PromotionSiteDetailRepo(db).get_by_promotion_site(service.promotion_id, target_site)
        if psd is None:
            raise bad_request("La sede no tiene plazas en la promoción de este servicio social.")
        occupied = SocialServiceRepo(db).count_in_site(
            service.promotion_id, target_site, exclude_social_service_id=service.social_service_id,
        )
        if occupied >= psd.capacity:
            raise conflict(f"La sede ya no tiene plazas disponibles ({occupied}/{psd.capacity}).")
    return SocialServiceRepo(db).update(service, payload)


def delete_social_service(db: Session, user: User, social_service_id: int) -> None:
    """Da de baja el servicio social y regresa la asignación a pendiente."""
    service = get_social_service(db, user, social_service_id)
    service.is_active = False
    service.application.status = ApplicationStatusEnum.PENDING
    db.commit()

