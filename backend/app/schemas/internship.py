from pydantic import BaseModel
from models.internship import DocumentTypeEnum, InternshipStatusEnum
from utils.validation import is_valid_period, is_valid_year
from typing import Optional, List


#-------------- APPLICATIONS ------------------

class InternshipApplicationInput(BaseModel):
    student_id: int
    is_accepted: bool

class InternshipApplicationUpdate(BaseModel):
    is_accepted: bool = None

class InternshipApplicationOutput(BaseModel):
    application_id: int
    student_id: int
    is_accepted: bool


#-------------- INTERNSHIPS ------------------

class InternshipInput(BaseModel):
    promotion_id: int
    application_id: int
    student_id: int
    site_id: int
    status: InternshipStatusEnum

class InternshipUpdate(BaseModel):
    promotion_id: int = None
    application_id: int = None
    student_id: int = None
    site_id: int = None
    status: InternshipStatusEnum = None

class InternshipOutput(BaseModel):
    internship_id: int
    promotion_id: int
    application_id: int
    student_id: int
    site_id: int
    status: InternshipStatusEnum


#-------------- DOCUMENTS ------------------

class InternshipDocumentInput(BaseModel):
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool = False

class InternshipDocumentUpdate(BaseModel):
    document_type: DocumentTypeEnum = None
    path: str = None
    is_verified: bool = None

class InternshipDocumentOutput(BaseModel):
    document_id: int
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool
