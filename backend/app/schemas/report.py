from pydantic import BaseModel, field_validator, HttpUrl
from typing import Optional
from datetime import date
from models.report import ReportTypeEnum
from utils.validation import is_valid_other_type_report


class ReportInput(BaseModel):
    academic_id: str
    site_id: int
    date_report: date
    report_type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence_url: Optional[HttpUrl] = None
    anonymity: bool = False
    is_open: bool = True

    @field_validator("other_type")
    def validate_other_type(cls, other_type):
        is_valid_other_type_report(other_type)
        return other_type

class ReportInputUpdate(BaseModel):
    site_id: Optional[int] = None
    date_report: Optional[date] = None
    report_type: Optional[ReportTypeEnum] = None
    other_type: Optional[str] = None
    description: Optional[str] = None
    evidence_url: Optional[HttpUrl] = None
    anonymity: Optional[bool] = None

    @field_validator("other_type")
    def validate_other_type(cls, other_type):
        is_valid_other_type_report(other_type)
        return other_type

class ReportInputUpdateByAdmin(BaseModel):
    is_open: Optional[bool] = None

class ReportOutput(BaseModel):
    report_id: int
    academic_id: str
    site_id: int
    date_report: date
    report_type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence_url: Optional[HttpUrl] = None
    anonymity: bool
    is_open: bool