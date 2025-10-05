from sqlalchemy.orm import Session
from models.promotion import Promotion, PromotionSiteDetail
from repos.promotion import PromotionRepo, PromotionSiteDetailRepo
from schemas.promotion import (
    PromotionInput, PromotionInputUpdate,
    PromotionSiteDetailInput, PromotionSiteDetailInputUpdate
)
from utils.utils import orm_to_dict, map_to_model


# ---------------------- PROMOTION ----------------------

def create_promotion(promotion: PromotionInput, db: Session):
    new_promotion = map_to_model(promotion, Promotion)
    promotion_repo = PromotionRepo(db)
    created_promotion = promotion_repo.create(new_promotion)
    promotion_response = orm_to_dict(created_promotion)
    return promotion_response

def get_all_promotions(db: Session):
    promotion_repo = PromotionRepo(db)
    promotions = promotion_repo.get_all()
    if not promotions:
        return []
    promotions_response = [orm_to_dict(promotion) for promotion in promotions]
    return promotions_response

def get_promotion(promotion_id: int, db: Session):
    promotion_repo = PromotionRepo(db)
    promotion = promotion_repo.get_by_id(promotion_id)
    if not promotion:
        return None
    promotion_response = orm_to_dict(promotion)
    return promotion_response

def update_promotion(promotion_id: int, promotion_input: PromotionInputUpdate, db: Session):
    update_data = promotion_input.dict(exclude_unset=True)
    promotion_repo = PromotionRepo(db)
    updated_promotion = promotion_repo.update(promotion_id, update_data)
    if not updated_promotion:
        return None
    promotion_response = orm_to_dict(updated_promotion)
    return promotion_response

def delete_promotion(promotion_id: int, db: Session):
    promotion_repo = PromotionRepo(db)
    return promotion_repo.delete(promotion_id)


# ---------------------- PROMOTION SITE DETAIL ----------------------

def create_promotion_site_detail(psd: PromotionSiteDetailInput, db: Session):
    new_psd = map_to_model(psd, PromotionSiteDetail)
    psd_repo = PromotionSiteDetailRepo(db)
    created_psd = psd_repo.create(new_psd)
    psd_response = orm_to_dict(created_psd)
    return psd_response

def get_all_promotion_site_details(db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    psds = psd_repo.get_all()
    if not psds:
        return []
    # psds_response = [orm_to_dict(psd) for psd in psds]
    return psds

def get_promotion_site_detail(psd_id: int, db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    psd = psd_repo.get_by_id(psd_id)
    if not psd:
        return None
    # psd_response = orm_to_dict(psd)
    return psd

def get_promotion_site_details_by_promotion(promotion_id: int, db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    psds = psd_repo.get_by_promotion_id(promotion_id)
    if not psds:
        return []
    # psds_response = [orm_to_dict(psd) for psd in psds]
    return psds

def update_promotion_site_detail(psd_id: int, psd_input: PromotionSiteDetailInputUpdate, db: Session):
    update_data = psd_input.dict(exclude_unset=True)
    psd_repo = PromotionSiteDetailRepo(db)
    updated_psd = psd_repo.update(psd_id, update_data)
    if not updated_psd:
        return None
    psd_response = orm_to_dict(updated_psd)
    return psd_response

def delete_promotion_site_detail(psd_id: int, db: Session):
    psd_repo = PromotionSiteDetailRepo(db)
    return psd_repo.delete(psd_id)