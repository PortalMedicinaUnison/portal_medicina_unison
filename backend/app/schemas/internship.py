from typing import Optional

from pydantic import BaseModel

from models.internship import ApplicationStatusEnum, InternshipStatusEnum
from schemas.common import AcademicId, ORMModel, UTCDateTime
from schemas.document import InscriptionProgress
from schemas.inscription import AverageField
from schemas.promotion import PromotionOutput
from schemas.site import SiteBasicOutput
from schemas.user import UserBasicOutput


# ---------------------- INTERNSHIP APPLICATION ----------------------

class InternshipApplicationInput(AverageField):
    promotion_id: int
    academic_id: AcademicId


class InternshipSummary(ORMModel):
    """Lo esencial del internado para mostrarlo junto a la asignación."""
    internship_id: int
    status: InternshipStatusEnum
    site_id: Optional[int] = None
    site: Optional[SiteBasicOutput] = None


class InternshipApplicationOutput(ORMModel):
    application_id: int
    promotion_id: int
    academic_id: str
    status: ApplicationStatusEnum
    created_at: UTCDateTime
    updated_at: UTCDateTime
    promotion: PromotionOutput
    student: Optional[UserBasicOutput] = None
    average: Optional[float] = None
    internship_id: Optional[int] = None
    internship: Optional[InternshipSummary] = None
    # Se calcula al listar o consultar asignaciones (no en las anidadas dentro del internado).
    inscription_progress: Optional[InscriptionProgress] = None


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
