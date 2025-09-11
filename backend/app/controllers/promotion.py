from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.promotion import Promotion, PromotionSiteDetail
from repos.promotion import PromotionRepo, PromotionSiteDetailRepo
from schemas.promotion import (
    PromotionInput,
    PromotionInputUpdate,
    PromotionSiteDetailInput,
    PromotionSiteDetailInputUpdate,
)
from utils.utils import orm_to_dict


# ----------------------  Promotion  ----------------------

def create_promotion(promotion: PromotionInput, db: Session):
    new_promotion = Promotion(
        year = promotion.year,
        period = promotion.period,
        is_finished = promotion.is_finished,
    )
    promotion_repo = PromotionRepo(db)
    created_promotion = promotion_repo.create(new_promotion)
    promotion_response = orm_to_dict(created_promotion)
    return promotion_response

def get_promotion(promotion_id: int, db: Session):
    promotion_repo = PromotionRepo(db)
    promotion = promotion_repo.get_by_id(promotion_id)
    if promotion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promoción no encontrada")
    promotion_response = orm_to_dict(promotion)
    return promotion_response

def get_all_promotions(db: Session):
    promotion_repo = PromotionRepo(db)
    promotions = promotion_repo.get_all()
    promotions_response = [orm_to_dict(promotion) for promotion in promotions]
    return promotions_response

def update_promotion(promotion_id: int, promotion_input: PromotionInputUpdate, db: Session):
    update_data = promotion_input.dict(exclude_unset=True)
    promotion_repo = PromotionRepo(db)
    updated_promotion = promotion_repo.update(promotion_id, update_data)
    if not updated_promotion:
        return None
    return {
        "promotion_id": updated_promotion.promotion_id,
        "year": updated_promotion.year,
        "period": updated_promotion.period,
        "is_finished": updated_promotion.is_finished,
    }

def delete_promotion(promotion_id: int, db: Session):
    promotion_repo = PromotionRepo(db)
    return promotion_repo.delete(promotion_id)


# ----------------------  Promotion Site Detail  ----------------------

def create_promotion_site_detail(psd: PromotionSiteDetailInput, db: Session):
    new_psd = PromotionSiteDetail(
        promotion_id = psd.promotion_id,
        site_id = psd.site_id,
        capacity = psd.capacity,
    )
    psd_repo = PromotionSiteDetailRepo(db)
    created_psd = psd_repo.create(new_psd)
    psd_response = orm_to_dict(created_psd)
    return psd_response

def get_promotion_site_detail(psd_id: int, db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    psd = psd_repo.get_by_id(psd_id)
    if psd is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detalle de promoción no encontrado")
    psd_response = orm_to_dict(psd)
    return psd_response

def get_all_promotion_site_details(db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    psds = psd_repo.get_all()
    psds_response = [orm_to_dict(psd) for psd in psds]
    return psds_response

def update_promotion_site_detail(psd_id: int, psd_input: PromotionSiteDetailInputUpdate, db: Session):
    update_data = psd_input.dict(exclude_unset=True)
    psd_repo = PromotionSiteDetailRepo(db)
    updated_psd = psd_repo.update(psd_id, update_data)
    if not updated_psd:
        return None
    return {
        "psd_id": updated_psd.psd_id,
        "promotion_id": updated_psd.promotion_id,
        "site_id": updated_psd.site_id,
        "capacity": updated_psd.capacity,
    }

def delete_promotion_site_detail(psd_id: int, db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    return psd_repo.delete(psd_id)

def get_promotion_site_details_by_promotion(promotion_id: int, db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    psds = psd_repo.get_by_promotion_id(promotion_id)
    if not psds:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron detalles de promoción para esta promoción")
    psds_response = [orm_to_dict(psd) for psd in psds]
    return psds_response

def get_promotion_site_details_by_site(site_id: int, db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    psds = psd_repo.get_by_site_id(site_id)
    if not psds:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron detalles de promoción para este sitio")
    psds_response = [orm_to_dict(psd) for psd in psds]
    return psds_response
