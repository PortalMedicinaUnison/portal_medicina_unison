from typing import List, Optional

from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, not_found
from models.promotion import ProgramEnum, Promotion, PromotionSiteDetail
from repos.internship import InternshipApplicationRepo, InternshipRepo
from repos.promotion import PromotionRepo, PromotionSiteDetailRepo
from repos.social_service import SocialServiceApplicationRepo, SocialServiceRepo
from repos.site import SiteRepo
from schemas.promotion import (
    PromotionInput, PromotionSiteDetailInput, PromotionSiteDetailUpdate, PromotionUpdate,
)


# ---------------------- PROMOTION ----------------------

def list_promotions(
    db: Session, program: Optional[ProgramEnum], year: Optional[int], period: Optional[int], is_finished: Optional[bool],
) -> List[Promotion]:
    return PromotionRepo(db).list(program=program, year=year, period=period, is_finished=is_finished)


def get_promotion(db: Session, promotion_id: int) -> Promotion:
    promotion = PromotionRepo(db).get(promotion_id)
    if promotion is None:
        raise not_found("Promoción no encontrada.")
    return promotion


def create_promotion(db: Session, data: PromotionInput) -> Promotion:
    repo = PromotionRepo(db)
    existing = db.query(Promotion).filter(
        Promotion.program == data.program, Promotion.year == data.year, Promotion.period == data.period,
    ).first()
    if existing and existing.is_active:
        raise conflict("Ya existe una promoción de ese programa con ese año y periodo.")
    if existing:
        return repo.update(existing, {**data.model_dump(), "is_active": True})
    return repo.add(Promotion(**data.model_dump()))


def update_promotion(db: Session, promotion_id: int, data: PromotionUpdate) -> Promotion:
    repo = PromotionRepo(db)
    promotion = get_promotion(db, promotion_id)
    payload = data.model_dump(exclude_unset=True)
    year, period = payload.get("year", promotion.year), payload.get("period", promotion.period)
    if (year, period) != (promotion.year, promotion.period):
        duplicate = db.query(Promotion).filter(
            Promotion.program == promotion.program, Promotion.year == year, Promotion.period == period,
        ).first()
        if duplicate:
            raise conflict("Ya existe una promoción de ese programa con ese año y periodo.")
    return repo.update(promotion, payload)


def delete_promotion(db: Session, promotion_id: int) -> None:
    promotion = get_promotion(db, promotion_id)
    applications = (
        SocialServiceApplicationRepo(db) if promotion.program == ProgramEnum.SOCIAL_SERVICE
        else InternshipApplicationRepo(db)
    )
    if applications.count_by_promotion(promotion_id):
        raise conflict("La promoción tiene asignaciones de estudiantes; elimínalas primero.")
    for psd in PromotionSiteDetailRepo(db).list(promotion_id=promotion_id):
        psd.is_active = False
    PromotionRepo(db).soft_delete(promotion)


# ---------------------- PROMOTION SITE DETAIL (cupos) ----------------------

def occupied_seats(db: Session, promotion: Promotion, site_id: int) -> int:
    """Lugares ocupados de una sede: internados o servicios sociales según el programa de la promoción."""
    if promotion.program == ProgramEnum.SOCIAL_SERVICE:
        return SocialServiceRepo(db).count_in_site(promotion.promotion_id, site_id)
    return InternshipRepo(db).count_in_site(promotion.promotion_id, site_id)


def _with_occupied(db: Session, psd: PromotionSiteDetail) -> PromotionSiteDetail:
    psd.occupied = occupied_seats(db, psd.promotion, psd.site_id)
    return psd


def list_promotion_site_details(db: Session, promotion_id: Optional[int], site_id: Optional[int]) -> List[PromotionSiteDetail]:
    return [_with_occupied(db, psd) for psd in PromotionSiteDetailRepo(db).list(promotion_id=promotion_id, site_id=site_id)]


def get_promotion_site_detail(db: Session, psd_id: int) -> PromotionSiteDetail:
    psd = PromotionSiteDetailRepo(db).get(psd_id)
    if psd is None:
        raise not_found("Cupo de sede no encontrado.")
    return _with_occupied(db, psd)


def create_promotion_site_detail(db: Session, data: PromotionSiteDetailInput) -> PromotionSiteDetail:
    repo = PromotionSiteDetailRepo(db)
    get_promotion(db, data.promotion_id)
    if SiteRepo(db).get(data.site_id) is None:
        raise bad_request("La sede seleccionada no existe.")
    existing = repo.get_by_promotion_site(data.promotion_id, data.site_id, include_inactive=True)
    if existing and existing.is_active:
        raise conflict("Esta sede ya tiene cupo en la promoción.")
    if existing:
        psd = repo.update(existing, {"capacity": data.capacity, "is_active": True})
    else:
        psd = repo.add(PromotionSiteDetail(**data.model_dump()))
    return _with_occupied(db, psd)


def update_promotion_site_detail(db: Session, psd_id: int, data: PromotionSiteDetailUpdate) -> PromotionSiteDetail:
    psd = get_promotion_site_detail(db, psd_id)
    if data.capacity < psd.occupied:
        raise conflict(f"La capacidad no puede ser menor que los internos ya asignados ({psd.occupied}).")
    psd = PromotionSiteDetailRepo(db).update(psd, {"capacity": data.capacity})
    return _with_occupied(db, psd)


def delete_promotion_site_detail(db: Session, psd_id: int) -> None:
    psd = get_promotion_site_detail(db, psd_id)
    if psd.occupied:
        raise conflict(f"La sede tiene {psd.occupied} interno(s) asignado(s) en esta promoción; reasígnalos primero.")
    PromotionSiteDetailRepo(db).soft_delete(psd)
