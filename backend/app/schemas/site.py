from pydantic import BaseModel, field_validator
from models.site import SiteTypeEnum
from typing import Optional
from utils.validation import is_valid_email


class SiteInput(BaseModel):
    admin_id: int
    name: str
    site_type: SiteTypeEnum
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    capacity: Optional[int] = None
    contact_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    is_available: bool = True

    @field_validator("contact_email")
    def validate_email(cls, email):
        is_valid_email(email)
        return email