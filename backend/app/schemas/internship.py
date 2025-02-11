from pydantic import BaseModel, validator
from datetime import datetime
from models.internship import DocumentTypeEnum


class InternshipEnrollmentCreate(BaseModel):
    student_id: int
    is_accepted: bool


class InternshipCreate(BaseModel):
    enrollment_id: int
    student_id: int
    site_id: int
    year: int
    period: int
    is_active: bool
    is_finished: bool

    @validator("period")
    def validate_period(cls, v: int) -> int:
        if v < 1:
            raise ValueError("El período debe ser al menos 1")
        return v


# -------------------------------------------------
# Esquema para validar la creación de un documento de práctica
# -------------------------------------------------
class InternshipDocumentCreate(BaseModel):
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    verification_status: bool
    submission_date: datetime

    @validator("path")
    def validate_path(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El path no puede estar vacío")
        return v
