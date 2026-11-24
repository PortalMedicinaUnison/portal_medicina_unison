from datetime import date
from typing import List, Optional

from models.communication import Announcement, AnnouncementTypeEnum, Survey
from .base import BaseRepo


class AnnouncementRepo(BaseRepo[Announcement]):
    model = Announcement

    def list(self, is_visible: Optional[bool] = None, announcement_type: Optional[AnnouncementTypeEnum] = None) -> List[Announcement]:
        query = self.query()
        if is_visible is not None:
            query = query.filter(Announcement.is_visible.is_(is_visible))
        if announcement_type is not None:
            query = query.filter(Announcement.announcement_type == announcement_type)
        return query.order_by(Announcement.created_at.desc(), Announcement.announcement_id.desc()).all()


class SurveyRepo(BaseRepo[Survey]):
    model = Survey

    def list(
        self,
        is_visible: Optional[bool] = None,
        mandatory: Optional[bool] = None,
        not_expired_on: Optional[date] = None,
    ) -> List[Survey]:
        query = self.query()
        if is_visible is not None:
            query = query.filter(Survey.is_visible.is_(is_visible))
        if mandatory is not None:
            query = query.filter(Survey.mandatory.is_(mandatory))
        if not_expired_on is not None:
            query = query.filter(Survey.expiration_date >= not_expired_on)
        return query.order_by(Survey.expiration_date, Survey.survey_id).all()
