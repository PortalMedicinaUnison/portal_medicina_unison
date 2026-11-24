from typing import List, Optional

from models.promotion import ProgramEnum, Promotion, PromotionSiteDetail
from .base import BaseRepo


class PromotionRepo(BaseRepo[Promotion]):
    model = Promotion

    def list(
        self, program: Optional[ProgramEnum] = None, year: Optional[int] = None,
        period: Optional[int] = None, is_finished: Optional[bool] = None,
    ) -> List[Promotion]:
        query = self.query()
        if program is not None:
            query = query.filter(Promotion.program == program)
        if year is not None:
            query = query.filter(Promotion.year == year)
        if period is not None:
            query = query.filter(Promotion.period == period)
        if is_finished is not None:
            query = query.filter(Promotion.is_finished.is_(is_finished))
        return query.order_by(Promotion.year.desc(), Promotion.period.desc()).all()

    def get_by_year_period(self, year: int, period: int) -> Optional[Promotion]:
        return self.query().filter(Promotion.year == year, Promotion.period == period).first()


class PromotionSiteDetailRepo(BaseRepo[PromotionSiteDetail]):
    model = PromotionSiteDetail

    def list(self, promotion_id: Optional[int] = None, site_id: Optional[int] = None) -> List[PromotionSiteDetail]:
        query = self.query()
        if promotion_id is not None:
            query = query.filter(PromotionSiteDetail.promotion_id == promotion_id)
        if site_id is not None:
            query = query.filter(PromotionSiteDetail.site_id == site_id)
        return query.order_by(PromotionSiteDetail.psd_id).all()

    def get_by_promotion_site(self, promotion_id: int, site_id: int, include_inactive: bool = False) -> Optional[PromotionSiteDetail]:
        query = self.session.query(PromotionSiteDetail) if include_inactive else self.query()
        return query.filter(
            PromotionSiteDetail.promotion_id == promotion_id,
            PromotionSiteDetail.site_id == site_id,
        ).first()
