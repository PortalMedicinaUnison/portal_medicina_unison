from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date
from models.report import ReportTypeEnum
from utils.validation import is_valid_other_type_report


class ReportInput(BaseModel):
    internship_id: int
    site_id: int
    date: date
    type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence: Optional[str] = None
    anonymity: bool = False
    is_open: bool = True
    admin_comment: Optional[str] = None

    @field_validator("other_type")
    def validate_other_type(cls, other_type):
        is_valid_other_type_report(other_type)
        return other_type

class ReportInputUpdate(BaseModel):
    evidence: Optional[str] = None
    anonymity: Optional[bool] = None

class ReportInputUpdateByAdmin(BaseModel):
    is_open: Optional[bool] = None
    admin_comment: Optional[str] = None

class ReportOutput(BaseModel):
    report_id: int
    student_id: int
    internship_id: int
    site_id: int
    date: date
    type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence: Optional[str] = None
    anonymity: bool
    is_open: bool
    admin_comment: Optional[str] = None