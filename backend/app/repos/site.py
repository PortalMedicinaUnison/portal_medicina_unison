from typing import List, Optional

from sqlalchemy import func

from models.promotion import ProgramEnum
from models.site import Institution, Site
from .base import BaseRepo


class InstitutionRepo(BaseRepo[Institution]):
    model = Institution

    def list(self) -> List[Institution]:
        return self.query().order_by(Institution.name).all()

    def get_by_name(self, name: str) -> Optional[Institution]:
        return self.session.query(Institution).filter(func.lower(Institution.name) == name.strip().lower()).first()


class SiteRepo(BaseRepo[Site]):
    model = Site

    def list(
        self, institution_id: Optional[int] = None, city: Optional[str] = None, program: Optional[ProgramEnum] = None,
    ) -> List[Site]:
        query = self.query()
        if institution_id is not None:
            query = query.filter(Site.institution_id == institution_id)
        if city:
            query = query.filter(Site.city == city)
        if program == ProgramEnum.INTERNSHIP:
            query = query.filter(Site.for_internship.is_(True))
        elif program == ProgramEnum.SOCIAL_SERVICE:
            query = query.filter(Site.for_social_service.is_(True))
        return query.order_by(Site.name).all()

    def get_by_name(self, name: str) -> Optional[Site]:
        return self.session.query(Site).filter(func.lower(Site.name) == name.strip().lower()).first()

    def count_active_by_institution(self, institution_id: int) -> int:
        return self.query().filter(Site.institution_id == institution_id).count()
