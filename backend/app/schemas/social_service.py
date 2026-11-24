from typing import Optional

from pydantic import BaseModel

from models.internship import ApplicationStatusEnum
from models.social_service import SocialServiceStatusEnum
from schemas.common import AcademicId, ORMModel, UTCDateTime
from schemas.document import InscriptionProgress
from schemas.promotion import PromotionOutput
from schemas.site import SiteBasicOutput
from schemas.user import UserBasicOutput


# ---------------------- SOCIAL SERVICE APPLICATION ----------------------

class SocialServiceApplicationInput(BaseModel):
    promotion_id: int
    academic_id: AcademicId


class SocialServiceApplicationOutput(ORMModel):
    application_id: int
    promotion_id: int
    academic_id: str
    status: ApplicationStatusEnum
    created_at: UTCDateTime
    updated_at: UTCDateTime
    promotion: PromotionOutput
    student: Optional[UserBasicOutput] = None
    social_service_id: Optional[int] = None
    # Se calcula al listar o consultar asignaciones (no en las anidadas dentro del servicio social).
    inscription_progress: Optional[InscriptionProgress] = None


# ---------------------- SOCIAL SERVICE ----------------------

class SocialServiceUpdate(BaseModel):
    site_id: Optional[int] = None
    status: SocialServiceStatusEnum = None


class SocialServiceOutput(ORMModel):
    social_service_id: int
    application_id: int
    academic_id: str
    promotion_id: int
    site_id: Optional[int] = None
    status: SocialServiceStatusEnum
    created_at: UTCDateTime
    updated_at: UTCDateTime
    application: SocialServiceApplicationOutput
    site: Optional[SiteBasicOutput] = None
