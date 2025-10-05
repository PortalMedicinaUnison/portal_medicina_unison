from pydantic import BaseModel
from models.internship import DocumentTypeEnum, InternshipStatusEnum, ApplicationStatusEnum
from schemas.promotion import PromotionOutput
from typing import Optional
from datetime import datetime


# ---------------------- INTERNSHIP APPLICATION ----------------------

class InternshipApplicationInput(BaseModel):
    promotion_id: int
    student_id: int
    status: ApplicationStatusEnum

class InternshipApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatusEnum] = None

class InternshipApplicationOutput(BaseModel):
    application_id: int
    promotion_id: int
    student_id: int
    status: ApplicationStatusEnum
    created_at: datetime
    promotion: PromotionOutput

# ---------------------- INTERNSHIP ----------------------

class InternshipInput(BaseModel):
    promotion_id: int
    application_id: int
    student_id: int
    site_id: int
    status: InternshipStatusEnum

class InternshipUpdate(BaseModel):
    promotion_id: Optional[int] = None
    application_id: Optional[int] = None
    student_id: Optional[int] = None
    site_id: Optional[int] = None
    status: Optional[InternshipStatusEnum] = None

class InternshipOutput(BaseModel):
    internship_id: int
    promotion_id: int
    application_id: int
    student_id: int
    site_id: int
    status: InternshipStatusEnum

# ---------------------- INTERNSHIP DOCUMENT ----------------------

class InternshipDocumentInput(BaseModel):
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool = False

class InternshipDocumentUpdate(BaseModel):
    document_type: Optional[DocumentTypeEnum] = None
    path: Optional[str] = None

class InternshipDocumentUpdateByAdmin(BaseModel):
    is_verified: Optional[bool]

class InternshipDocumentOutput(BaseModel):
    document_id: int
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool
