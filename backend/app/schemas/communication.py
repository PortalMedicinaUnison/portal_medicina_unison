from pydantic import BaseModel, field_validator, HttpUrl
from typing import Optional
from datetime import date
from models.communication import AnnouncementTypeEnum
from utils.validation import is_valid_future_date


# ---------------------- ANNOUNCEMENT ----------------------

class AnnouncementInput(BaseModel):
    title: str
    announcement_type: AnnouncementTypeEnum
    description: Optional[str] = None
    is_visible: bool = True

class AnnouncementInputUpdate(BaseModel):
    title: Optional[str] = None
    announcement_type: Optional[AnnouncementTypeEnum] = None
    description: Optional[str] = None
    is_visible: Optional[bool] = None

class AnnouncementOutput(BaseModel):
    announcement_id: int
    title: str
    announcement_type: AnnouncementTypeEnum
    description: Optional[str] = None
    is_visible: bool = True

# ---------------------- SURVEY ----------------------

class SurveyInput(BaseModel):
    title: str
    web_link: HttpUrl
    description: Optional[str] = None
    expiration_date: date
    mandatory: bool

    @field_validator("expiration_date")
    def validate_expiration_date(cls, input_date: date) -> date:
        is_valid_future_date(input_date)
        return input_date

class SurveyInputUpdate(BaseModel):
    title: Optional[str] = None
    web_link: Optional[HttpUrl] = None
    description: Optional[str] = None
    expiration_date: Optional[date] = None
    mandatory: Optional[bool] = None

    @field_validator("expiration_date")
    def validate_expiration_date(cls, input_date: Optional[date]) -> Optional[date]:
        if input_date:
            is_valid_future_date(input_date)
        return input_date

class SurveyOutput(BaseModel):
    survey_id: int
    title: str
    web_link: HttpUrl
    description: Optional[str] = None
    expiration_date: date
    mandatory: bool
