from pydantic import BaseModel
from models.internship import DocumentTypeEnum, InternshipStatusEnum


# ---------------------- INTERNSHIP APPLICATION ----------------------

class InternshipApplicationInput(BaseModel):
    student_id: int
    is_accepted: bool

class InternshipApplicationUpdate(BaseModel):
    is_accepted: bool = None

class InternshipApplicationOutput(BaseModel):
    application_id: int
    student_id: int
    is_accepted: bool

# ---------------------- INTERNSHIP ----------------------

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

# ---------------------- INTERNSHIP DOCUMENT ----------------------

class InternshipDocumentInput(BaseModel):
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool = False

class InternshipDocumentUpdate(BaseModel):
    document_type: DocumentTypeEnum = None
    path: str = None

class InternshipDocumentUpdateByAdmin(BaseModel):
    is_verified: bool

class InternshipDocumentOutput(BaseModel):
    document_id: int
    internship_id: int
    document_type: DocumentTypeEnum
    path: str
    is_verified: bool
