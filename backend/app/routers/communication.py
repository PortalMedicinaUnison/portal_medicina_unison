from typing import List, Optional

from fastapi import APIRouter, status

from controllers import communication as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from models.communication import AnnouncementTypeEnum
from schemas.communication import (
    AnnouncementInput, AnnouncementOutput, AnnouncementUpdate, SurveyInput, SurveyOutput, SurveyUpdate,
)

# ----------------------  ANNOUNCEMENT  ----------------------

announcement_router = APIRouter(prefix="/announcements", tags=["Avisos"])


@announcement_router.get("", response_model=List[AnnouncementOutput])
def list_announcements(
    user: CurrentUser, db: DbSession,
    is_visible: Optional[bool] = None, announcement_type: Optional[AnnouncementTypeEnum] = None,
):
    """Los estudiantes solo reciben avisos visibles."""
    return controller.list_announcements(db, user, is_visible=is_visible, announcement_type=announcement_type)


@announcement_router.post("", response_model=AnnouncementOutput, status_code=status.HTTP_201_CREATED)
def create_announcement(data: AnnouncementInput, _admin: AdminUser, db: DbSession):
    return controller.create_announcement(db, data)


@announcement_router.get("/{announcement_id}", response_model=AnnouncementOutput)
def get_announcement(announcement_id: int, user: CurrentUser, db: DbSession):
    return controller.get_announcement(db, user, announcement_id)


@announcement_router.patch("/{announcement_id}", response_model=AnnouncementOutput)
def update_announcement(announcement_id: int, data: AnnouncementUpdate, admin: AdminUser, db: DbSession):
    return controller.update_announcement(db, admin, announcement_id, data)


@announcement_router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(announcement_id: int, admin: AdminUser, db: DbSession):
    controller.delete_announcement(db, admin, announcement_id)


# ----------------------  SURVEY  ----------------------

survey_router = APIRouter(prefix="/surveys", tags=["Encuestas"])


@survey_router.get("", response_model=List[SurveyOutput])
def list_surveys(user: CurrentUser, db: DbSession, is_visible: Optional[bool] = None, mandatory: Optional[bool] = None):
    """Los estudiantes solo reciben encuestas visibles y vigentes."""
    return controller.list_surveys(db, user, is_visible=is_visible, mandatory=mandatory)


@survey_router.post("", response_model=SurveyOutput, status_code=status.HTTP_201_CREATED)
def create_survey(data: SurveyInput, _admin: AdminUser, db: DbSession):
    return controller.create_survey(db, data)


@survey_router.get("/{survey_id}", response_model=SurveyOutput)
def get_survey(survey_id: int, user: CurrentUser, db: DbSession):
    return controller.get_survey(db, user, survey_id)


@survey_router.patch("/{survey_id}", response_model=SurveyOutput)
def update_survey(survey_id: int, data: SurveyUpdate, admin: AdminUser, db: DbSession):
    return controller.update_survey(db, admin, survey_id, data)


@survey_router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_survey(survey_id: int, admin: AdminUser, db: DbSession):
    controller.delete_survey(db, admin, survey_id)
