from datetime import date
from typing import Optional

from pydantic import BaseModel, model_validator

from models.report import ReportTypeEnum
from schemas.common import OptionalHttpUrlStr, OptionalStr, ORMModel, PastOrTodayDate, RequiredStr, UTCDateTime
from schemas.site import SiteBasicOutput
from schemas.user import UserBasicOutput

OTHER_TYPE_REQUIRED = "Describe el tipo de reporte cuando eliges «Otro»."


class ReportInput(BaseModel):
    """Lo envía el estudiante; el expediente y el internado se toman de su sesión."""
    site_id: int
    date_report: PastOrTodayDate
    report_type: ReportTypeEnum
    other_type: OptionalStr(25) = None
    description: RequiredStr(10000)
    evidence_url: OptionalHttpUrlStr = None
    anonymity: bool = False

    @model_validator(mode="after")
    def check_other_type(self):
        if self.report_type == ReportTypeEnum.OTHER and not self.other_type:
            raise ValueError(OTHER_TYPE_REQUIRED)
        if self.report_type != ReportTypeEnum.OTHER:
            self.other_type = None
        return self


class ReportUpdate(BaseModel):
    site_id: int = None
    date_report: PastOrTodayDate = None
    report_type: ReportTypeEnum = None
    other_type: OptionalStr(25) = None
    description: RequiredStr(10000) = None
    evidence_url: OptionalHttpUrlStr = None
    anonymity: bool = None


class ReportStatusUpdate(BaseModel):
    is_open: bool


class ReportOutput(ORMModel):
    report_id: int
    academic_id: Optional[str] = None  # None si el reporte es anónimo y lo consulta un administrador
    student: Optional[UserBasicOutput] = None
    site_id: int
    site: SiteBasicOutput
    internship_id: Optional[int] = None
    social_service_id: Optional[int] = None
    date_report: date
    report_type: ReportTypeEnum
    other_type: Optional[str] = None
    description: str
    evidence_url: Optional[str] = None
    anonymity: bool
    is_open: bool
    created_at: UTCDateTime
    updated_at: UTCDateTime
