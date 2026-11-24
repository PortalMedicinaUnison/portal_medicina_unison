from typing import Annotated

from pydantic import AfterValidator, BaseModel, Field

from models.promotion import ProgramEnum
from schemas.common import ORMModel
from schemas.site import SiteBasicOutput
from utils.dates import local_today
from utils.validation import validate_period, validate_year


def _validate_new_year(year: int) -> int:
    validate_year(year)
    if year < local_today().year:
        raise ValueError("El año de la promoción no puede ser anterior al actual.")
    return year


Period = Annotated[int, AfterValidator(validate_period)]
Year = Annotated[int, AfterValidator(validate_year)]
NewYear = Annotated[int, AfterValidator(_validate_new_year)]
Capacity = Annotated[int, Field(ge=1, le=1000)]


# ---------------------- PROMOTIONS ----------------------

class PromotionInput(BaseModel):
    program: ProgramEnum = ProgramEnum.INTERNSHIP
    year: NewYear
    period: Period
    is_finished: bool = False


class PromotionUpdate(BaseModel):
    year: Year = None
    period: Period = None
    is_finished: bool = None


class PromotionOutput(ORMModel):
    promotion_id: int
    program: ProgramEnum
    year: int
    period: int
    is_finished: bool


# ---------------------- PROMOTION SITE DETAIL ----------------------

class PromotionSiteDetailInput(BaseModel):
    promotion_id: int
    site_id: int
    capacity: Capacity


class PromotionSiteDetailUpdate(BaseModel):
    capacity: Capacity


class PromotionSiteDetailOutput(ORMModel):
    psd_id: int
    promotion_id: int
    site_id: int
    capacity: int
    occupied: int = 0
    site: SiteBasicOutput
