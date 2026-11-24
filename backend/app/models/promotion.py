from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Index, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel

if TYPE_CHECKING:
    from .site import Site


# ----------------------  PROMOTION  ----------------------

class Promotion(BaseModel):
    """Promoción de internado: año y periodo (1 = primera, 2 = segunda del año)."""
    __tablename__ = "promotions"
    __table_args__ = (
        UniqueConstraint("year", "period", name="uq_promotion_year_period"),
        Index("ix_promotion_year_period", "year", "period"),
    )

    promotion_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)
    is_finished: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self):
        return f"<Promotion(promotion_id={self.promotion_id}, year={self.year}, period={self.period}, is_finished={self.is_finished})>"


# ----------------------  PROMOTION SITE DETAIL  ----------------------

class PromotionSiteDetail(BaseModel):
    """Cupo (capacity) de una sede dentro de una promoción."""
    __tablename__ = "promotion_site_details"
    __table_args__ = (
        UniqueConstraint("promotion_id", "site_id", name="uq_psd_promotion_site"),
        Index("ix_psd_promotion_id", "promotion_id"),
        Index("ix_psd_site_id", "site_id"),
    )

    psd_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id"), nullable=False)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.site_id"), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    site: Mapped["Site"] = relationship(back_populates="promotion_details", lazy="joined")

    def __repr__(self):
        return f"<PromotionSiteDetail(promotion_id={self.promotion_id}, site_id={self.site_id}, capacity={self.capacity})>"
