# routers/promotion.py

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.dependencies import get_db
from schemas.promotion import (
    PromotionInput,
    PromotionInputUpdate,
    PromotionOutput,
    PromotionSiteDetailInput,
    PromotionSiteDetailInputUpdate,
    PromotionSiteDetailOutput
)
from controllers.promotion import (
    # Promotion
    create_promotion,
    get_promotion,
    get_all_promotions,
    update_promotion,
    delete_promotion,
    # Promotion Site Detail
    create_promotion_site_detail,
    get_promotion_site_detail,
    get_all_promotion_site_details,
    update_promotion_site_detail,
    delete_promotion_site_detail,
    get_promotion_site_details_by_promotion,
    get_promotion_site_details_by_site,
)

# ----------------------  Promotions  ----------------------

promotion_router = APIRouter(prefix="/promotions", tags=["Promociones"])

@promotion_router.post("/", response_model=PromotionInput)
async def create_promotion_route(payload: PromotionInput, db: Session = Depends(get_db)):
    promotion = create_promotion(payload, db)
    if not promotion:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear la promoción")
    return promotion

@promotion_router.get("/{promotion_id}", response_model=PromotionInput)
async def get_promotion_route(promotion_id: int, db: Session = Depends(get_db)):
    promotion = get_promotion(promotion_id, db)
    if not promotion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promoción no encontrada")
    return promotion

@promotion_router.get("/", response_model=List[PromotionOutput])
async def get_promotions_route(db: Session = Depends(get_db)):
    promotions = get_all_promotions(db)
    if not promotions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay promociones")
    return promotions

@promotion_router.patch("/{promotion_id}", response_model=PromotionInput)
async def update_promotion_route(promotion_id: int, promotion: PromotionInputUpdate, db: Session = Depends(get_db)):
    promotion = update_promotion(promotion_id, promotion, db)
    if not promotion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promoción no encontrada")
    return promotion

@promotion_router.delete("/{promotion_id}")
async def delete_promotion_route(promotion_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    promotion = delete_promotion(promotion_id, db)
    if not promotion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promoción no encontrada")
    return promotion


# ----------------------  Promotion Site Details  ----------------------

psd_router = APIRouter(prefix="/psd", tags=["Detalles de Promoción"])

@psd_router.post("/", response_model=PromotionSiteDetailInput)
async def create_promotion_site_detail_route(psd: PromotionSiteDetailInput, db: Session = Depends(get_db)):
    psd = create_promotion_site_detail(psd, db)
    if not psd:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el detalle de promoción")
    return psd

@psd_router.get("/{psd_id}", response_model=PromotionSiteDetailInput)
async def get_psd_route(psd_id: int, db: Session = Depends(get_db)):
    psd = get_promotion_site_detail(psd_id, db)
    if not psd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detalle de promoción no encontrado")
    return psd

@psd_router.get("/", response_model=List[PromotionSiteDetailOutput])
async def get_all_psd_route(db: Session = Depends(get_db)):
    psds = get_all_promotion_site_details(db)
    if not psds:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay detalles de promoción")
    return psds

@psd_router.get("/{promotion_id}", response_model=List[PromotionSiteDetailInput])
async def get_psd_by_promotion_route(promotion_id: int, db: Session = Depends(get_db)):
    psds = get_promotion_site_details_by_promotion(promotion_id, db)
    if not psds:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron detalles para la promoción indicada",
        )
    return psds

@psd_router.get("/by-site/{site_id}", response_model=List[PromotionSiteDetailInput])
async def get_psd_by_site_route(site_id: int, db: Session = Depends(get_db)):
    psds = get_promotion_site_details_by_site(site_id, db)
    if not psds:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron detalles para el sitio indicado",
        )
    return psds

@psd_router.patch("/{psd_id}", response_model=PromotionSiteDetailInput)
async def update_psd_route(psd_id: int, psd: PromotionSiteDetailInputUpdate, db: Session = Depends(get_db)):
    updated = update_promotion_site_detail(psd_id, psd, db)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detalle de promoción no encontrado")
    return updated

@psd_router.delete("/id/{psd_id}")
async def delete_psd_route(psd_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    psd = delete_promotion_site_detail(psd_id, db)
    if not psd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detalle de promoción no encontrado")
    return psd
