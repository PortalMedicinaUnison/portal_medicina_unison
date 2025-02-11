from pydantic import BaseModel, validator
from models.internship import DocumentTypeEnum, InternshipStatusEnum
from utils.validation import is_valid_period, is_valid_internship_year


class InternshipEnrollmentCreate(BaseModel):
    student_id: int
    is_accepted: bool

class InternshipCreate(BaseModel):
    enrollment_id: int
    student_id: int
    site_id: int
    year: int
    period: int
    status: InternshipStatusEnum
    is_active: bool

    @validator("period")
    def validate_period(cls, period: int) -> int:
        is_valid_period(period)
        return period

    @validator("year")
    def validate_year(cls, year: int) -> int:
        is_valid_internship_year(year)
        return year

class InternshipDocumentCreate(BaseModel):
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    verification_status: bool
