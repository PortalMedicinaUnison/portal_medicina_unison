from sqlalchemy.orm import Session
from repos.communication import AnnouncementRepo, SurveyRepo
from models.communication import Announcement, Survey
from schemas.communication import (
    AnnouncementInput, AnnouncementInputUpdate,
    SurveyInput, SurveyInputUpdate)
from utils.utils import orm_to_dict, map_to_model


# ---------------------- ANNOUCEMENT ----------------------

def create_announcement(announcement: AnnouncementInput, db: Session):
    new_announcement = map_to_model(announcement, Announcement)
    announcement_repo = AnnouncementRepo(db)
    created_announcement = announcement_repo.create(new_announcement)
    announcement_response = orm_to_dict(created_announcement)
    return announcement_response

def get_all_announcements(db: Session):
    announcement_repo = AnnouncementRepo(db)
    announcements = announcement_repo.get_all()
    if not announcements:
        return []
    announcements_response = [orm_to_dict(announcement) for announcement in announcements]
    return announcements_response

def get_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    announcement = announcement_repo.get_by_id(announcement_id)
    if not announcement:
        return None
    announcement_response = orm_to_dict(announcement)
    return announcement_response

def update_announcement(announcement_id: int, announcement: AnnouncementInputUpdate, db: Session):
    update_data = announcement.dict(exclude_unset=True)
    announcement_repo = AnnouncementRepo(db)
    updated_announcement = announcement_repo.update(announcement_id, update_data)
    if not updated_announcement:
        return None
    updated_announcement_response = orm_to_dict(updated_announcement)
    return updated_announcement_response
    
def delete_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    return announcement_repo.delete(announcement_id)

# ---------------------- SURVEY ----------------------

def create_survey(survey: SurveyInput, db: Session):
    new_survey = map_to_model(survey, Survey)
    survey_repo = SurveyRepo(db)
    created_survey = survey_repo.create(new_survey)
    survey_response = orm_to_dict(created_survey)
    return survey_response

def get_all_surveys(db: Session):
    survey_repo = SurveyRepo(db)
    surveys = survey_repo.get_all()
    if not surveys:
        return []
    surveys_response = [orm_to_dict(survey) for survey in surveys]
    return surveys_response

def get_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    survey = survey_repo.get_by_id(survey_id)
    if not survey:
        return None
    survey_response = orm_to_dict(survey)
    return survey_response

def update_survey(survey_id: int, survey: SurveyInputUpdate, db: Session):
    update_data = survey.dict(exclude_unset=True)
    survey_repo = SurveyRepo(db)
    updated_survey = survey_repo.update(survey_id, update_data)
    if not updated_survey:
        return None
    updated_survey_response = orm_to_dict(updated_survey)
    return updated_survey_response
    
def delete_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    return survey_repo.delete(survey_id)