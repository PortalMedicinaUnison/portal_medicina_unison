from pydantic import BaseModel, field_validator
from typing import List, Optional
from utils.validation import is_valid_email
from utils.constants import MUNICIPALITY_SET


# ---------------------- SITE ----------------------

class SiteInput(BaseModel):
    name: str
    institution_id: int
    address: str
    city: str
    teaching_head_name: str
    teaching_head_email: Optional[str] = None
    teaching_head_phone: Optional[str] = None
    teaching_deputy_name: str = None
    teaching_deputy_email: Optional[str] = None
    teaching_deputy_phone: Optional[str] = None

    @field_validator("teaching_head_email")
    def validate_email(cls, email):
        if email:
            is_valid_email(email)
        return email
    
    @field_validator("teaching_deputy_email")
    def validate_deputy_email(cls, email):
        if email:
            is_valid_email(email)
        return email
    
    @field_validator("city")
    @classmethod
    def validate_city(cls, v: str):
        if v not in MUNICIPALITY_SET:
            raise ValueError("Municipio inválido")
        return v
    
class SiteInputUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    teaching_head_name: Optional[str] = None
    teaching_head_email: Optional[str] = None
    teaching_head_phone: Optional[str] = None
    teaching_deputy_name: Optional[str] = None
    teaching_deputy_email: Optional[str] = None
    teaching_deputy_phone: Optional[str] = None

    @field_validator("teaching_head_email")
    def validate_email(cls, email):
        if email:
            is_valid_email(email)
        return email
    
    @field_validator("teaching_deputy_email")
    def validate_deputy_email(cls, email):
        if email:
            is_valid_email(email)
        return email
    
    @field_validator("city")
    @classmethod
    def validate_city(cls, v: str):
        if v not in MUNICIPALITY_SET:
            raise ValueError("Municipio inválido")
        return v

class SiteOutput(BaseModel):
    site_id: int
    institution_id: int
    name: str
    address: str
    city: str
    teaching_head_name: str
    teaching_head_email: str
    teaching_head_phone: str
    teaching_deputy_name: str
    teaching_deputy_email: str
    teaching_deputy_phone: str

class SiteBasicOutput(BaseModel):
    site_id: int
    name: str
    city: str

# ---------------------- INSTITUTION ----------------------

class InstitutionInput(BaseModel):
    name: str

class InstitutionInputUpdate(BaseModel):
    name: Optional[str]

class InstitutionOutput(BaseModel):
    institution_id: int
    name: str
    sites: List[SiteOutput] = []