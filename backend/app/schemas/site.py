from pydantic import BaseModel, field_validator
from models.site import SiteTypeEnum
from typing import Optional
from utils.validation import is_valid_email

#---------------SITE-------------------
class SiteInput(BaseModel):
    institution_id: int
    admin_id: int
    name: str
    site_type: SiteTypeEnum
    address: str
    city: str
    state: str
    capacity: int
    director: str
    subdirector: str
    contact_email: str
    contact_phone: Optional[str] = None
    
    is_available: bool = True

    @field_validator("contact_email")
    def validate_email(cls, email):
        is_valid_email(email)
        return email
    
#---------------INSTITUTION-------------------
class InstitutionInput(BaseModel):
    name: str
