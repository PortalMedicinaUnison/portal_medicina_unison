from datetime import date
from typing import List, Optional

from sqlalchemy.orm import Session

from core.errors import not_found
from models.communication import Announcement, AnnouncementTypeEnum, Survey
from models.user import User
from repos.communication import AnnouncementRepo, SurveyRepo
from schemas.communication import AnnouncementInput, AnnouncementUpdate, SurveyInput, SurveyUpdate


# ---------------------- ANNOUNCEMENT ----------------------

def list_announcements(
    db: Session, user: User, is_visible: Optional[bool], announcement_type: Optional[AnnouncementTypeEnum],
) -> List[Announcement]:
    """Los estudiantes solo ven avisos visibles."""
    visible = is_visible if user.is_staff else True
    return AnnouncementRepo(db).list(is_visible=visible, announcement_type=announcement_type)


def get_announcement(db: Session, user: User, announcement_id: int) -> Announcement:
    announcement = AnnouncementRepo(db).get(announcement_id)
    if announcement is None or (not user.is_staff and not announcement.is_visible):
        raise not_found("Aviso no encontrado.")
    return announcement


def create_announcement(db: Session, data: AnnouncementInput) -> Announcement:
    return AnnouncementRepo(db).add(Announcement(**data.model_dump()))


def update_announcement(db: Session, user: User, announcement_id: int, data: AnnouncementUpdate) -> Announcement:
    announcement = get_announcement(db, user, announcement_id)
    return AnnouncementRepo(db).update(announcement, data.model_dump(exclude_unset=True))


def delete_announcement(db: Session, user: User, announcement_id: int) -> None:
    announcement = get_announcement(db, user, announcement_id)
    AnnouncementRepo(db).soft_delete(announcement)


# ---------------------- SURVEY ----------------------

def list_surveys(db: Session, user: User, is_visible: Optional[bool], mandatory: Optional[bool]) -> List[Survey]:
    """Los estudiantes solo ven encuestas visibles y vigentes."""
    if user.is_staff:
        return SurveyRepo(db).list(is_visible=is_visible, mandatory=mandatory)
    return SurveyRepo(db).list(is_visible=True, mandatory=mandatory, not_expired_on=date.today())


def get_survey(db: Session, user: User, survey_id: int) -> Survey:
    survey = SurveyRepo(db).get(survey_id)
    if survey is None or (not user.is_staff and (not survey.is_visible or survey.expiration_date < date.today())):
        raise not_found("Encuesta no encontrada.")
    return survey


def create_survey(db: Session, data: SurveyInput) -> Survey:
    return SurveyRepo(db).add(Survey(**data.model_dump()))


def update_survey(db: Session, user: User, survey_id: int, data: SurveyUpdate) -> Survey:
    survey = get_survey(db, user, survey_id)
    return SurveyRepo(db).update(survey, data.model_dump(exclude_unset=True))


def delete_survey(db: Session, user: User, survey_id: int) -> None:
    survey = get_survey(db, user, survey_id)
    SurveyRepo(db).soft_delete(survey)
