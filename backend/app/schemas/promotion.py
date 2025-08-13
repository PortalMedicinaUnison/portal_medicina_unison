from pydantic import BaseModel, field_validator
from utils.validation import is_valid_period, is_valid_year, is_valid_capacity

#---------------PROMOTION-------------------
class PromotionInput(BaseModel):
    promotion_id: int
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
    is_finished: bool = False

#---------------PROMOTION SITE DETAIL-------------------
class PromotionSiteDetailInput(BaseModel):
    psd_id: int
    promotion_id: int
    site_id: int
    capacity: int

class PromotionSiteDetailInputUpdate(BaseModel):
    capacity: int

    @field_validator("capacity")
    def validate_capacity(cls, capacity):
        if capacity:
            is_valid_capacity(capacity)
        return capacity