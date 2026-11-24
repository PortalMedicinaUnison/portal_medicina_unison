from typing import List, Optional

from fastapi import APIRouter, status

from controllers import promotion as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from models.promotion import ProgramEnum
from schemas.promotion import (
    PromotionInput, PromotionOutput, PromotionSiteDetailInput, PromotionSiteDetailOutput,
    PromotionSiteDetailUpdate, PromotionUpdate, SeatsInput,
)

# ----------------------  PROMOTION  ----------------------

promotion_router = APIRouter(prefix="/promotions", tags=["Promociones"])


@promotion_router.get("", response_model=List[PromotionOutput])
def list_promotions(
    _user: CurrentUser, db: DbSession, program: Optional[ProgramEnum] = None,
    year: Optional[int] = None, period: Optional[int] = None, is_finished: Optional[bool] = None,
):
    """Filtros: `program` (1 internado, 2 servicio social), `year`, `period` e `is_finished`."""
    return controller.list_promotions(db, program=program, year=year, period=period, is_finished=is_finished)


@promotion_router.post("", response_model=PromotionOutput, status_code=status.HTTP_201_CREATED)
def create_promotion(data: PromotionInput, _admin: AdminUser, db: DbSession):
    """Basta `start_date`: `end_date` se propone a doce meses y `year`/`period` se derivan de la fecha de inicio."""
    return controller.create_promotion(db, data)


@promotion_router.get("/{promotion_id}", response_model=PromotionOutput)
def get_promotion(promotion_id: int, _user: CurrentUser, db: DbSession):
    return controller.get_promotion(db, promotion_id)


@promotion_router.patch("/{promotion_id}", response_model=PromotionOutput)
def update_promotion(promotion_id: int, data: PromotionUpdate, _admin: AdminUser, db: DbSession):
    return controller.update_promotion(db, promotion_id, data)


@promotion_router.delete("/{promotion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promotion(promotion_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_promotion(db, promotion_id)


@promotion_router.patch("/{promotion_id}/seats", response_model=List[PromotionSiteDetailOutput])
def set_seats(promotion_id: int, data: SeatsInput, _admin: AdminUser, db: DbSession):
    """
    Cupos de varias sedes a la vez (`capacity` 0 = sin cupo); las sedes que no se envían no cambian.
    Todo o nada: si una fila no es válida (sede que no ofrece el programa, cupo menor que los ya
    asignados) no se guarda ninguna. Devuelve todos los cupos de la promoción.
    """
    return controller.set_seats(db, promotion_id, data)


# ----------------------  PROMOTION SITE DETAIL (cupos por sede)  ----------------------

psd_router = APIRouter(prefix="/promotion-site-details", tags=["Cupos por sede"])


@psd_router.get("", response_model=List[PromotionSiteDetailOutput])
def list_promotion_site_details(
    _user: CurrentUser, db: DbSession, promotion_id: Optional[int] = None, site_id: Optional[int] = None,
):
    """Cupos por sede; `occupied` indica cuántos internos ya ocupan el cupo."""
    return controller.list_promotion_site_details(db, promotion_id=promotion_id, site_id=site_id)


@psd_router.post("", response_model=PromotionSiteDetailOutput, status_code=status.HTTP_201_CREATED)
def create_promotion_site_detail(data: PromotionSiteDetailInput, _admin: AdminUser, db: DbSession):
    return controller.create_promotion_site_detail(db, data)


@psd_router.get("/{psd_id}", response_model=PromotionSiteDetailOutput)
def get_promotion_site_detail(psd_id: int, _user: CurrentUser, db: DbSession):
    return controller.get_promotion_site_detail(db, psd_id)


@psd_router.patch("/{psd_id}", response_model=PromotionSiteDetailOutput)
def update_promotion_site_detail(psd_id: int, data: PromotionSiteDetailUpdate, _admin: AdminUser, db: DbSession):
    return controller.update_promotion_site_detail(db, psd_id, data)


@psd_router.delete("/{psd_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promotion_site_detail(psd_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_promotion_site_detail(db, psd_id)
