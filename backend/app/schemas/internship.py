from pydantic import BaseModel, field_validator
from models.internship import DocumentTypeEnum, InternshipStatusEnum
from utils.validation import is_valid_period, is_valid_internship_year


class InternshipEnrollmentInput(BaseModel):
    student_id: int
    is_accepted: bool

class InternshipInput(BaseModel):
    enrollment_id: int
    student_id: int
    site_id: int
    year: int
    period: int
    status: InternshipStatusEnum

    @field_validator("period")
    def validate_period(cls, period: int) -> int:
        is_valid_period(period)
        return period

    @field_validator("year")
    def validate_year(cls, year: int) -> int:
        is_valid_internship_year(year)
        return year

class InternshipDocumentInput(BaseModel):
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool
