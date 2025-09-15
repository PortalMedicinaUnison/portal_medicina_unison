from pydantic import BaseModel, field_validator, HttpUrl
from typing import Optional
from datetime import date, datetime
from enum import IntEnum
from models.communication import ReportTypeEnum, AnnouncementTypeEnum
from utils.validation import is_valid_future_date, is_valid_past_date


# ---------------  Announcement  ----------------------

class AnnouncementInput(BaseModel):
    created_by: int
    title: str
    announcement_type: AnnouncementTypeEnum
    description: Optional[str] = None

class AnnouncementOutput(BaseModel):
    announcement_id: int
    title: str
    announcement_type: AnnouncementTypeEnum
    description: Optional[str] = None
    is_active: bool = True

# ---------------  Survey  ----------------------

class SurveyInput(BaseModel):
    created_by: int
    title: str
    web_link: HttpUrl
    description: Optional[str] = None
    expiration_date: date
    mandatory: bool

    @field_validator("expiration_date")
    def validate_expiration_date(cls, input_date: date) -> date:
        is_valid_future_date(input_date)
        return input_date

class SurveyOutput(BaseModel):
    survey_id: int
    title: str
    web_link: HttpUrl
    description: Optional[str] = None
    expiration_date: date
    mandatory: bool
    is_active: bool = True

# ---------------  Report  ----------------------

class ReportInput(BaseModel):
    internship_id: int
    site_id: int
    date_report: date
    report_type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence: Optional[str] = None
    anonymity: bool = False

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str):
        if not v or len(v.strip()) < 10:
            raise ValueError("La descripción debe tener al menos 10 caracteres")
        if len(v) > 1000:
            raise ValueError("La descripción no puede exceder 1000 caracteres")
        return v.strip()

    @field_validator("other_type")
    @classmethod
    def validate_other_type(cls, v: Optional[str], info):
        report_type = info.data.get("report_type")
        if report_type == ReportTypeEnum.OTHER and (not v or len(v.strip()) < 3):
            raise ValueError("Debe especificar el tipo de reporte cuando selecciona 'Otro'")
        if v and len(v) > 50:
            raise ValueError("El tipo personalizado no puede exceder 50 caracteres")
        return v.strip() if v else v

    @field_validator("evidence")
    @classmethod
    def validate_evidence(cls, v: Optional[str]):
        if v and len(v) > 255:
            raise ValueError("La evidencia no puede exceder 255 caracteres")
        return v


class ReportInputUpdate(BaseModel):
    internship_id: Optional[int] = None
    site_id: Optional[int] = None
    date_report: Optional[date] = None
    report_type: Optional[ReportTypeEnum] = None
    other_type: Optional[str] = None
    description: Optional[str] = None
    evidence: Optional[str] = None
    anonymity: Optional[bool] = None
    is_active: Optional[bool] = None

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: Optional[str]):
        if v is not None:
            if not v or len(v.strip()) < 10:
                raise ValueError("La descripción debe tener al menos 10 caracteres")
            if len(v) > 1000:
                raise ValueError("La descripción no puede exceder 1000 caracteres")
            return v.strip()
        return v

    @field_validator("other_type")
    @classmethod
    def validate_other_type(cls, v: Optional[str], info):
        if v is not None:
            report_type = info.data.get("report_type")
            if report_type == ReportTypeEnum.OTHER and (not v or len(v.strip()) < 3):
                raise ValueError("Debe especificar el tipo de reporte cuando selecciona 'Otro'")
            if v and len(v) > 50:
                raise ValueError("El tipo personalizado no puede exceder 50 caracteres")
            return v.strip() if v else v
        return v

    @field_validator("evidence")
    @classmethod
    def validate_evidence(cls, v: Optional[str]):
        if v and len(v) > 255:
            raise ValueError("La evidencia no puede exceder 255 caracteres")
        return v


class ReportOutput(BaseModel):
    report_id: int
    student_id: int
    internship_id: int
    site_id: int
    date_report: date
    report_type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence: Optional[str] = None
    anonymity: bool
    is_open: bool
    admin_comment: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ReportCreateResponse(BaseModel):
    report_id: int
    message: str = "Reporte creado exitosamente"


class ReportStatusUpdate(BaseModel):
    is_active: bool


class ReportAdminComment(BaseModel):
    admin_comment: str

    @field_validator("admin_comment")
    @classmethod
    def validate_admin_comment(cls, v: str):
        if not v or len(v.strip()) < 5:
            raise ValueError("El comentario del administrador debe tener al menos 5 caracteres")
        if len(v) > 1000:
            raise ValueError("El comentario del administrador no puede exceder 1000 caracteres")
        return v.strip()

    @field_validator("date")
    def validate_date(cls, date: date) -> date:
        is_valid_past_date(date)
        return date
