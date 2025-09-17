from sqlalchemy import Boolean, Integer, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .site import Site         

# ----------------------  PROMOTION  ----------------------

class Promotion(BaseModel):
    __tablename__ = 'promotions'
    
    promotion_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)
    is_finished: Mapped[bool] = mapped_column(Boolean, nullable=False)

    def __repr__(self):
        return f"<Promotion(promotion_id={self.promotion_id}, year={self.year}, period={self.period}, is_finished={self.is_finished})>"
    
# ----------------------  PROMOTION SITE DETAIL  ----------------------

class PromotionSiteDetail(BaseModel):
    __tablename__ = 'promotion_site_details'

    psd_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id", ondelete="CASCADE"), nullable=False)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.site_id", ondelete="CASCADE"), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    
    site: Mapped["Site"] = relationship(
        "Site",
        back_populates="promotion_details",
        lazy="joined",
    )

    __table_args__ = (
        UniqueConstraint('promotion_id', 'site_id', name='uq_psd_promotion_site'),
        Index('ix_psd_promotion_id', 'promotion_id'),
        Index('ix_psd_site_id', 'site_id'),
    )

    def __repr__(self):
        return f"<PromotionSiteDetail(promotion_id={self.promotion_id}, site_id={self.site_id}, capacity={self.capacity})>"