from datetime import date
from typing import List, Optional

from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, not_found
from models.promotion import (
    ProgramEnum, Promotion, PromotionSiteDetail, date_range_problem, default_dates, one_year_after, period_of,
)
from repos.internship import InternshipApplicationRepo, InternshipRepo
from repos.promotion import PromotionRepo, PromotionSiteDetailRepo
from repos.social_service import SocialServiceApplicationRepo, SocialServiceRepo
from repos.site import SiteRepo
from schemas.promotion import (
    PromotionInput, PromotionSiteDetailInput, PromotionSiteDetailUpdate, PromotionUpdate, SeatsInput,
)

PROGRAM_NAMES = {ProgramEnum.INTERNSHIP: "el internado", ProgramEnum.SOCIAL_SERVICE: "el servicio social"}
OF_PROGRAM = {ProgramEnum.INTERNSHIP: "del internado", ProgramEnum.SOCIAL_SERVICE: "del servicio social"}
ASSIGNED_NOUNS = {ProgramEnum.INTERNSHIP: "internos", ProgramEnum.SOCIAL_SERVICE: "pasantes"}


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


def _same_semester(db: Session, program: ProgramEnum, year: int, period: int) -> Optional[Promotion]:
    """Hay una promoción por programa y semestre de inicio (año y periodo), incluidas las eliminadas."""
    return db.query(Promotion).filter(
        Promotion.program == program, Promotion.year == year, Promotion.period == period,
    ).first()


def _duplicate(promotion: Promotion) -> Exception:
    return conflict(
        f"Ya existe la promoción {promotion.label} {OF_PROGRAM[promotion.program]}; "
        "solo puede haber una que inicie en cada semestre."
    )


def _check_range(start: Optional[date], end: Optional[date]) -> None:
    problem = date_range_problem(start, end)
    if problem:
        raise bad_request(problem)


def create_promotion(db: Session, data: PromotionInput) -> Promotion:
    """Con la fecha de inicio basta: el término se propone a doce meses; año y periodo se derivan."""
    repo = PromotionRepo(db)
    payload = data.model_dump()
    start, end = payload["start_date"], payload["end_date"]
    if start is None:  # año y periodo: fechas habituales del programa
        start, default_end = default_dates(data.program, data.year, data.period)
        end = end or default_end
    end = end or one_year_after(start)
    _check_range(start, end)
    payload.update(start_date=start, end_date=end, year=start.year, period=period_of(start))

    existing = _same_semester(db, data.program, payload["year"], payload["period"])
    if existing and existing.is_active:
        raise _duplicate(existing)
    if existing:
        return repo.update(existing, {**payload, "is_active": True})
    return repo.add(Promotion(**payload))


def update_promotion(db: Session, promotion_id: int, data: PromotionUpdate) -> Promotion:
    """
    Si cambia la fecha de inicio sin indicar la de término, el término se recalcula a doce meses.
    Cambiar año o periodo (forma anterior) aplica las fechas habituales del programa.
    """
    repo = PromotionRepo(db)
    promotion = get_promotion(db, promotion_id)
    payload = data.model_dump(exclude_unset=True)
    if "start_date" not in payload and ("year" in payload or "period" in payload):
        year, period = payload.get("year", promotion.year), payload.get("period", promotion.period)
        if (year, period) != (promotion.year, promotion.period):
            start, default_end = default_dates(promotion.program, year, period)
            payload.setdefault("end_date", default_end)
            payload["start_date"] = start
    if "start_date" in payload:
        start = payload["start_date"]
        payload.update(year=start.year, period=period_of(start))
        payload.setdefault("end_date", one_year_after(start))
    _check_range(payload.get("start_date", promotion.start_date), payload.get("end_date", promotion.end_date))

    year, period = payload.get("year", promotion.year), payload.get("period", promotion.period)
    if (year, period) != (promotion.year, promotion.period):
        duplicate = _same_semester(db, promotion.program, year, period)
        if duplicate:
            raise _duplicate(duplicate)
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


def _not_served(site, promotion: Promotion) -> str:
    return f"{site.name} no ofrece cupos para {PROGRAM_NAMES[promotion.program]} (puedes cambiarlo en la sede)."


def create_promotion_site_detail(db: Session, data: PromotionSiteDetailInput) -> PromotionSiteDetail:
    repo = PromotionSiteDetailRepo(db)
    promotion = get_promotion(db, data.promotion_id)
    site = SiteRepo(db).get(data.site_id)
    if site is None:
        raise bad_request("La sede seleccionada no existe.")
    if not site.serves(promotion.program):
        raise bad_request(_not_served(site, promotion))
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
        raise conflict(
            f"La capacidad no puede ser menor que los {ASSIGNED_NOUNS[psd.promotion.program]} ya asignados ({psd.occupied})."
        )
    psd = PromotionSiteDetailRepo(db).update(psd, {"capacity": data.capacity})
    return _with_occupied(db, psd)


def delete_promotion_site_detail(db: Session, psd_id: int) -> None:
    psd = get_promotion_site_detail(db, psd_id)
    if psd.occupied:
        raise conflict(
            f"La sede tiene {psd.occupied} {ASSIGNED_NOUNS[psd.promotion.program]} asignados en esta promoción; reasígnalos primero."
        )
    PromotionSiteDetailRepo(db).soft_delete(psd)


def set_seats(db: Session, promotion_id: int, data: SeatsInput) -> List[PromotionSiteDetail]:
    """
    Guarda los cupos de varias sedes a la vez (0 = sin cupo); las sedes que no se envían no cambian.
    Se valida todo antes de guardar: si una fila no es válida no se guarda ninguna.
    """
    promotion = get_promotion(db, promotion_id)
    site_ids = [row.site_id for row in data.seats]
    if len(set(site_ids)) != len(site_ids):
        raise bad_request("Una sede aparece más de una vez.")

    repo, sites = PromotionSiteDetailRepo(db), SiteRepo(db)
    errors, changes = [], []
    for row in data.seats:
        site = sites.get(row.site_id)
        if site is None:
            errors.append(f"La sede {row.site_id} no existe.")
            continue
        psd = repo.get_by_promotion_site(promotion_id, row.site_id, include_inactive=True)
        active = psd is not None and psd.is_active
        occupied = occupied_seats(db, promotion, row.site_id)
        if row.capacity < occupied:
            errors.append(
                f"{site.name} tiene {occupied} {ASSIGNED_NOUNS[promotion.program]} asignados; el cupo no puede ser menor."
            )
        elif row.capacity and not active and not site.serves(promotion.program):
            errors.append(_not_served(site, promotion))
        else:
            changes.append((row, psd, active))
    if errors:
        raise conflict("No se guardó ningún cupo. " + " ".join(errors))

    for row, psd, active in changes:
        if row.capacity == 0:
            if active:
                psd.is_active = False
        elif psd is None:
            db.add(PromotionSiteDetail(promotion_id=promotion_id, site_id=row.site_id, capacity=row.capacity))
        else:
            psd.capacity, psd.is_active = row.capacity, True
    db.commit()
    return list_promotion_site_details(db, promotion_id=promotion_id, site_id=None)
