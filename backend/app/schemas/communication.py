from pydantic import BaseModel, field_validator, HttpUrl
from typing import Optional
from datetime import date
from models.communication import ReportTypeEnum, AnnouncementTypeEnum
from utils.validation import is_valid_future_date, is_valid_past_date


# ---------------  Announcement  ----------------------

class AnnouncementInput(BaseModel):
    admin_id: int
    title: str
    announcement_type: AnnouncementTypeEnum
    description: Optional[str] = None

# ---------------  Survey  ----------------------

class SurveyInput(BaseModel):
    admin_id: int
    title: str
    web_link: HttpUrl
    description: Optional[str] = None
    expiration_date: date
    mandatory: bool

    @field_validator("expiration_date")
    def validate_expiration_date(cls, input_date: date) -> date:
        is_valid_future_date(input_date)
        return input_date

# ---------------  Report  ----------------------
class ReportInput(BaseModel):
    student_id: int
    internship_id: int
    date: date
    site: str
    report_type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence: Optional[str] = None
    anonymity: bool
    is_open: bool = True
    admin_comment: Optional[str] = None

    @field_validator("date")
    def validate_date(cls, date: date) -> date:
        is_valid_past_date(date)
        return date