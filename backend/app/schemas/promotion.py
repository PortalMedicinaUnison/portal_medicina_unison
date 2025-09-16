from pydantic import BaseModel, field_validator
from schemas.site import SiteBasicOutput
from utils.validation import is_valid_period, is_valid_year, is_valid_capacity


# -------------- PROMOTIONS ------------------
class PromotionInput(BaseModel):
    year: int
    period: int
    is_finished: bool

    @field_validator("year")
    def validate_year(cls, year):
        if year:
            is_valid_year(year)
        return year

    @field_validator("period")
    def validate_period(cls, period):
        if period:
            is_valid_period(period)
        return period

class PromotionInputUpdate(BaseModel):
    promotion_id: int
    is_finished: bool = False

class PromotionOutput(BaseModel):
    promotion_id: int
    year: int
    period: int
    is_finished: bool

# -------------- PROMOTION SITE DETAIL ------------------
class PromotionSiteDetailInput(BaseModel):
    promotion_id: int
    site_id: int
    capacity: int

class PromotionSiteDetailInputUpdate(BaseModel):
    psd_id: int
    capacity: int

    @field_validator("capacity")
    def validate_capacity(cls, capacity):
        if capacity:
            is_valid_capacity(capacity)
        return capacity

class PromotionSiteDetailOutput(BaseModel):
    psd_id: int
    promotion_id: int
    site_id: int
    capacity: int
    site: SiteBasicOutput