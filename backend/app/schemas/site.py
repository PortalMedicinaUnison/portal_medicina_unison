from pydantic import BaseModel, validator
from models.site import SiteTypeEnum
from typing import Optional
from utils.validation import is_valid_email


class SiteCreate(BaseModel):
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
    is_active: bool = True

    @validator("email")
    def validate_email(cls, input):
        is_valid_email(input)
        return input

    @validator("capacity")
    def validate_capacity(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("La capacidad debe ser un número positivo")
        return v
