from typing import List, Optional

from fastapi import APIRouter, status

from controllers import promotion as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from schemas.promotion import (
    PromotionInput, PromotionOutput, PromotionSiteDetailInput, PromotionSiteDetailOutput,
    PromotionSiteDetailUpdate, PromotionUpdate,
)

# ----------------------  PROMOTION  ----------------------

promotion_router = APIRouter(prefix="/promotions", tags=["Promociones"])


@promotion_router.get("", response_model=List[PromotionOutput])
def list_promotions(
    _user: CurrentUser, db: DbSession,
    year: Optional[int] = None, period: Optional[int] = None, is_finished: Optional[bool] = None,
):
    return controller.list_promotions(db, year=year, period=period, is_finished=is_finished)


@promotion_router.post("", response_model=PromotionOutput, status_code=status.HTTP_201_CREATED)
def create_promotion(data: PromotionInput, _admin: AdminUser, db: DbSession):
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
