from typing import Optional

from pydantic import BaseModel

from models.internship import ApplicationStatusEnum, DocumentTypeEnum, InternshipStatusEnum
from schemas.common import AcademicId, ORMModel, UTCDateTime
from schemas.promotion import PromotionOutput
from schemas.site import SiteBasicOutput
from schemas.user import UserBasicOutput


# ---------------------- INTERNSHIP APPLICATION ----------------------

class InternshipApplicationInput(BaseModel):
    promotion_id: int
    academic_id: AcademicId


class InternshipApplicationOutput(ORMModel):
    application_id: int
    promotion_id: int
    academic_id: str
    status: ApplicationStatusEnum
    created_at: UTCDateTime
    updated_at: UTCDateTime
    promotion: PromotionOutput
    student: Optional[UserBasicOutput] = None
    internship_id: Optional[int] = None


# ---------------------- INTERNSHIP ----------------------

class InternshipUpdate(BaseModel):
    site_id: Optional[int] = None
    status: InternshipStatusEnum = None


class InternshipOutput(ORMModel):
    internship_id: int
    application_id: int
    academic_id: str
    promotion_id: int
    site_id: Optional[int] = None
    status: InternshipStatusEnum
    created_at: UTCDateTime
    updated_at: UTCDateTime
    application: InternshipApplicationOutput
    site: Optional[SiteBasicOutput] = None


# ---------------------- INTERNSHIP DOCUMENT ----------------------

class InternshipDocumentOutput(ORMModel):
    document_id: int
    internship_id: int
    document_type: DocumentTypeEnum
    media_type: str
    original_filename: Optional[str] = None
    created_at: UTCDateTime
