from typing import List, Optional

from sqlalchemy.orm import selectinload

from models.internship import ApplicationStatusEnum, Internship, InternshipApplication, InternshipStatusEnum
from .base import BaseRepo


class InternshipApplicationRepo(BaseRepo[InternshipApplication]):
    model = InternshipApplication

    def list(
        self,
        promotion_id: Optional[int] = None,
        academic_id: Optional[str] = None,
        status: Optional[ApplicationStatusEnum] = None,
    ) -> List[InternshipApplication]:
        query = self.query()
        if promotion_id is not None:
            query = query.filter(InternshipApplication.promotion_id == promotion_id)
        if academic_id:
            query = query.filter(InternshipApplication.academic_id == academic_id)
        if status is not None:
            query = query.filter(InternshipApplication.status == status)
        return (
            query.options(selectinload(InternshipApplication.internship))
            .order_by(InternshipApplication.created_at.desc(), InternshipApplication.application_id.desc())
            .all()
        )

    def get_by_promotion_student(self, promotion_id: int, academic_id: str, include_inactive: bool = False) -> Optional[InternshipApplication]:
        query = self.session.query(InternshipApplication) if include_inactive else self.query()
        return query.filter(
            InternshipApplication.promotion_id == promotion_id,
            InternshipApplication.academic_id == academic_id,
        ).first()

    def count_by_promotion(self, promotion_id: int) -> int:
        return self.query().filter(InternshipApplication.promotion_id == promotion_id).count()


class InternshipRepo(BaseRepo[Internship]):
    model = Internship

    def _joined(self):
        return self.query().join(Internship.application)

    def list(
        self,
        promotion_id: Optional[int] = None,
        site_id: Optional[int] = None,
        academic_id: Optional[str] = None,
        status: Optional[InternshipStatusEnum] = None,
    ) -> List[Internship]:
        query = self._joined()
        if promotion_id is not None:
            query = query.filter(InternshipApplication.promotion_id == promotion_id)
        if site_id is not None:
            query = query.filter(Internship.site_id == site_id)
        if academic_id:
            query = query.filter(InternshipApplication.academic_id == academic_id)
        if status is not None:
            query = query.filter(Internship.status == status)
        return query.order_by(Internship.created_at.desc(), Internship.internship_id.desc()).all()

    def get_by_application(self, application_id: int) -> Optional[Internship]:
        return self.query().filter(Internship.application_id == application_id).first()

    def get_by_application_any(self, application_id: int) -> Optional[Internship]:
        """Incluye internados dados de baja (application_id es único en la tabla)."""
        return self.session.query(Internship).filter(Internship.application_id == application_id).first()

    def count_in_site(self, promotion_id: int, site_id: int, exclude_internship_id: Optional[int] = None) -> int:
        """Internados que ocupan cupo (activos o suspendidos) de una sede en una promoción."""
        query = self._joined().filter(
            InternshipApplication.promotion_id == promotion_id,
            Internship.site_id == site_id,
            Internship.status != InternshipStatusEnum.FINISHED,
        )
        if exclude_internship_id is not None:
            query = query.filter(Internship.internship_id != exclude_internship_id)
        return query.count()

    def count_by_site(self, site_id: int) -> int:
        return self.query().filter(Internship.site_id == site_id).count()
