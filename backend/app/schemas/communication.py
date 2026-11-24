from datetime import date
from typing import Optional

from pydantic import BaseModel

from models.communication import AnnouncementTypeEnum
from schemas.common import FutureOrTodayDate, HttpUrlStr, OptionalStr, ORMModel, RequiredStr, UTCDateTime


# ---------------------- ANNOUNCEMENT ----------------------

class AnnouncementInput(BaseModel):
    title: RequiredStr(100)
    announcement_type: AnnouncementTypeEnum
    description: RequiredStr(10000)
    is_visible: bool = True


class AnnouncementUpdate(BaseModel):
    title: RequiredStr(100) = None
    announcement_type: AnnouncementTypeEnum = None
    description: RequiredStr(10000) = None
    is_visible: bool = None


class AnnouncementOutput(ORMModel):
    announcement_id: int
    title: str
    announcement_type: AnnouncementTypeEnum
    description: str
    is_visible: bool
    created_at: UTCDateTime
    updated_at: UTCDateTime


# ---------------------- SURVEY ----------------------

class SurveyInput(BaseModel):
    title: RequiredStr(100)
    url: HttpUrlStr
    description: OptionalStr(10000) = None
    expiration_date: FutureOrTodayDate
    mandatory: bool = False
    is_visible: bool = True


class SurveyUpdate(BaseModel):
    title: RequiredStr(100) = None
    url: HttpUrlStr = None
    description: OptionalStr(10000) = None
    expiration_date: FutureOrTodayDate = None
    mandatory: bool = None
    is_visible: bool = None


class SurveyOutput(ORMModel):
    survey_id: int
    title: str
    url: str
    description: Optional[str] = None
    expiration_date: date
    mandatory: bool
    is_visible: bool
    created_at: UTCDateTime
    updated_at: UTCDateTime
