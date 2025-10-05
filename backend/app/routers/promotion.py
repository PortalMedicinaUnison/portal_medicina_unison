from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.dependencies import get_db
from typing import List, Dict, Any
from schemas.promotion import (
    PromotionInput, PromotionInputUpdate, PromotionOutput,
    PromotionSiteDetailInput, PromotionSiteDetailInputUpdate, PromotionSiteDetailOutput
)
from controllers.promotion import (
    create_promotion,
    get_promotion,
    get_all_promotions,
    update_promotion,
    delete_promotion,

    create_promotion_site_detail,
    get_promotion_site_detail,
    get_all_promotion_site_details,
    update_promotion_site_detail,
    delete_promotion_site_detail,
    get_promotion_site_details_by_promotion,
)

# ----------------------  PROMOTION  ----------------------

promotion_router = APIRouter(prefix="/promotions", tags=["Promociones"])

@promotion_router.post("/", response_model=PromotionOutput)
async def create_promotion_route(payload: PromotionInput, db: Session = Depends(get_db)):
    created_promotion = create_promotion(payload, db)
    if not created_promotion:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear la promoción"
        )
    return created_promotion

@promotion_router.get("/", response_model=List[PromotionOutput])
async def get_promotions_route(db: Session = Depends(get_db)):
    promotions = get_all_promotions(db)
    return promotions

@promotion_router.get("/{promotion_id}", response_model=PromotionOutput)
async def get_promotion_route(promotion_id: int, db: Session = Depends(get_db)):
    promotion = get_promotion(promotion_id, db)
    if not promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Promoción no encontrada"
        )
    return promotion

@promotion_router.patch("/{promotion_id}", response_model=PromotionOutput)
async def update_promotion_route(promotion_id: int, promotion: PromotionInputUpdate, db: Session = Depends(get_db)):
    updated_promotion = update_promotion(promotion_id, promotion, db)
    if not updated_promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promoción no encontrada"
        )
    return updated_promotion

@promotion_router.delete("/{promotion_id}")
async def delete_promotion_route(promotion_id: int, db: Session = Depends(get_db)):
    deleted = delete_promotion(promotion_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promoción no encontrada"
        )
    return deleted

# ----------------------  PROMOTION SITE DETAIL  ----------------------

psd_router = APIRouter(prefix="/promotion-site-details", tags=["Detalles de Promoción"])

@psd_router.post("/", response_model=PromotionSiteDetailOutput)
async def create_promotion_site_detail_route(psd: PromotionSiteDetailInput, db: Session = Depends(get_db)):
    created_psd = create_promotion_site_detail(psd, db)
    if not created_psd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear el detalle de promoción"
        )
    return created_psd

@psd_router.get("/", response_model=List[PromotionSiteDetailOutput])
async def get_all_psd_route(db: Session = Depends(get_db)):
    psds = get_all_promotion_site_details(db)
    return psds

@psd_router.get("/{psd_id}", response_model=PromotionSiteDetailOutput)
async def get_psd_route(psd_id: int, db: Session = Depends(get_db)):
    psd = get_promotion_site_detail(psd_id, db)
    if not psd:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Detalle de promoción no encontrado"
        )
    return psd

@psd_router.get("/promotionId/{promotion_id}", response_model=List[PromotionSiteDetailOutput])
async def get_psd_by_promotion_route(promotion_id: int, db: Session = Depends(get_db)):
    psds = get_promotion_site_details_by_promotion(promotion_id, db)
    return psds

@psd_router.patch("/{psd_id}", response_model=PromotionSiteDetailOutput)
async def update_psd_route(psd_id: int, psd: PromotionSiteDetailInputUpdate, db: Session = Depends(get_db)):
    updated_psd = update_promotion_site_detail(psd_id, psd, db)
    if not updated_psd:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Detalle de promoción no encontrado"
        )
    return updated_psd

@psd_router.delete("/{psd_id}")
async def delete_psd_route(psd_id: int, db: Session = Depends(get_db)):
    deleted = delete_promotion_site_detail(psd_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detalle de promoción no encontrado"
        )
    return deleted
