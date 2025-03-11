from pydantic import BaseModel, validator, HttpUrl
from typing import Optional
from datetime import date
from models.communication import ReportTypeEnum, AnnouncementTypeEnum
from utils.validation import is_valid_future_date, is_valid_web_link, is_valid_past_date


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

    @validator("expiration_date")
    def validate_expiration_date(cls, input_date: date) -> date:
        is_valid_future_date(input_date)
        return input_date

    @validator("web_link")
    def validate_web_link(cls, web_link: HttpUrl) -> HttpUrl:
        is_valid_web_link(str(web_link))
        return web_link

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

    @validator("date")
    def validate_date(cls, date: date) -> date:
        is_valid_past_date(date)
        return date