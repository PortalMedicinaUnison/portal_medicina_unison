from pydantic import BaseModel
from models.internship import DocumentTypeEnum, InternshipStatusEnum
from utils.validation import is_valid_period, is_valid_year


class InternshipEnrollmentInput(BaseModel):
    student_id: int
    is_accepted: bool

class InternshipInput(BaseModel):
    promotion_id: int
    enrollment_id: int
    student_id: int
    site_id: int
    status: InternshipStatusEnum

class InternshipDocumentInput(BaseModel):
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool
