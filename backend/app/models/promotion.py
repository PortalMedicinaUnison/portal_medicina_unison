from sqlalchemy import Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

class Promotion(BaseModel):
    __tablename__ = 'promotions'
    
    promotion_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False)

    def __repr__(self):
        return f"<Promotion(promotion_id={self.promotion_id}, year={self.year}, period={self.period}, is_active={self.is_active})>"

class PromotionSiteDetail(BaseModel):
    __tablename__ = 'promotion_site_details'

    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id"), primary_key=True)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.site_id"), primary_key=True)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    def __repr__(self):
        return f"<PromotionSiteDetail(promotion_id={self.promotion_id}, site_id={self.site_id}, capacity={self.capacity}, is_available={self.is_available})>"