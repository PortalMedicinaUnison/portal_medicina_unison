from .base import BaseRepo
from models.promotion import Promotion, PromotionSiteDetail


# ----------------------  PROMOTION  ----------------------

class PromotionRepo(BaseRepo):
    def create(self, data: Promotion) -> Promotion:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> list[Promotion]:
        return self.session.query(Promotion).filter(
                Promotion.is_active == True
            ).all()
    
    def get_by_id(self, promotion_id: int) -> Promotion:
        return self.session.query(Promotion).filter(
                Promotion.promotion_id == promotion_id,
                Promotion.is_active == True,
            ).first()
    
    def update(self, promotion_id: int, data: dict) -> Promotion:
        promotion = self.get_by_id(promotion_id)
        if promotion:
            for key, value in data.items():
                if hasattr(promotion, key):
                    setattr(promotion, key, value)
            self.session.commit()
            self.session.refresh(promotion)
        return promotion
    
    def delete(self, promotion_id: int) -> bool:
        promotion = self.get_by_id(promotion_id)
        if promotion:
            promotion.is_active = False
            self.session.commit()
            return True
        return False

# ---------------  PROMOTION SITE DETAIL  ----------------------

class PromotionSiteDetailRepo(BaseRepo):
    
    def create(self, data: PromotionSiteDetail) -> PromotionSiteDetail:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_all(self) -> list[PromotionSiteDetail]:
        return self.session.query(PromotionSiteDetail).filter(
                PromotionSiteDetail.is_active == True
            ).all()

    def get_by_id(self, psd_id: int) -> PromotionSiteDetail:
        return self.session.query(PromotionSiteDetail).filter(
                PromotionSiteDetail.psd_id == psd_id,
                PromotionSiteDetail.is_active == True,
            ).first()
        
    def get_by_promotion_id(self, promotion_id: int):
        return self.session.query(PromotionSiteDetail).filter(
                PromotionSiteDetail.promotion_id == promotion_id,
                PromotionSiteDetail.is_active == True,
            ).all()

    def get_by_site_id(self, site_id: int):
        return self.session.query(PromotionSiteDetail).filter(
                PromotionSiteDetail.site_id == site_id,
                PromotionSiteDetail.is_active == True
            ).all()
    
    def update(self, psd_id: int, data: dict) -> PromotionSiteDetail:
        psd = self.get_by_id(psd_id)
        if psd:
            for key, value in data.items():
                if hasattr(psd, key):
                    setattr(psd, key, value)
            self.session.commit()
            self.session.refresh(psd)
        return psd
    
    def delete(self, psd_id: int) -> bool:
        psd = self.get_by_id(psd_id)
        if psd:
            psd.is_active = False
            self.session.commit()
            return True
        return False