from typing import List, Optional

from sqlalchemy.orm import selectinload

from models.internship import ApplicationStatusEnum
from models.social_service import (
    SOCIAL_SERVICE_IN_COURSE, SocialService, SocialServiceApplication, SocialServiceStatusEnum,
)
from .base import BaseRepo


class SocialServiceApplicationRepo(BaseRepo[SocialServiceApplication]):
    model = SocialServiceApplication

    def list(
        self,
        promotion_id: Optional[int] = None,
        academic_id: Optional[str] = None,
        status: Optional[ApplicationStatusEnum] = None,
    ) -> List[SocialServiceApplication]:
        query = self.query()
        if promotion_id is not None:
            query = query.filter(SocialServiceApplication.promotion_id == promotion_id)
        if academic_id:
            query = query.filter(SocialServiceApplication.academic_id == academic_id)
        if status is not None:
            query = query.filter(SocialServiceApplication.status == status)
        return (
            query.options(selectinload(SocialServiceApplication.social_service))
            .order_by(SocialServiceApplication.created_at.desc(), SocialServiceApplication.application_id.desc())
            .all()
        )

    def get_by_promotion_student(
        self, promotion_id: int, academic_id: str, include_inactive: bool = False,
    ) -> Optional[SocialServiceApplication]:
        query = self.session.query(SocialServiceApplication) if include_inactive else self.query()
        return query.filter(
            SocialServiceApplication.promotion_id == promotion_id,
            SocialServiceApplication.academic_id == academic_id,
        ).first()

    def count_by_promotion(self, promotion_id: int) -> int:
        return self.query().filter(SocialServiceApplication.promotion_id == promotion_id).count()


class SocialServiceRepo(BaseRepo[SocialService]):
    model = SocialService

    def _joined(self):
        return self.query().join(SocialService.application)

    def list(
        self,
        promotion_id: Optional[int] = None,
        site_id: Optional[int] = None,
        academic_id: Optional[str] = None,
        status: Optional[SocialServiceStatusEnum] = None,
    ) -> List[SocialService]:
        query = self._joined()
        if promotion_id is not None:
            query = query.filter(SocialServiceApplication.promotion_id == promotion_id)
        if site_id is not None:
            query = query.filter(SocialService.site_id == site_id)
        if academic_id:
            query = query.filter(SocialServiceApplication.academic_id == academic_id)
        if status is not None:
            query = query.filter(SocialService.status == status)
        return query.order_by(SocialService.created_at.desc(), SocialService.social_service_id.desc()).all()

    def get_by_application(self, application_id: int) -> Optional[SocialService]:
        return self.query().filter(SocialService.application_id == application_id).first()

    def get_by_application_any(self, application_id: int) -> Optional[SocialService]:
        """Incluye servicios dados de baja (application_id es único en la tabla)."""
        return self.session.query(SocialService).filter(SocialService.application_id == application_id).first()

    def count_in_site(self, promotion_id: int, site_id: int, exclude_social_service_id: Optional[int] = None) -> int:
        """Servicios que ocupan plaza (activos o suspendidos) de una sede en una promoción."""
        query = self._joined().filter(
            SocialServiceApplication.promotion_id == promotion_id,
            SocialService.site_id == site_id,
            SocialService.status.in_(SOCIAL_SERVICE_IN_COURSE),
        )
        if exclude_social_service_id is not None:
            query = query.filter(SocialService.social_service_id != exclude_social_service_id)
        return query.count()

    def count_by_site(self, site_id: int) -> int:
        return self.query().filter(SocialService.site_id == site_id).count()
