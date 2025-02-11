from pydantic import BaseModel, validator
from typing import Optional
from utils.validation import is_valid_academic_id, is_valid_password, is_valid_email


class PreRegisteredUser(BaseModel):
    academic_id: str
    assigned_year: int
    assigned_period: int

    @validator("academic_id")
    def validate_academic_id(cls, input):
        is_valid_academic_id(input)
        return input

class User(BaseModel):
    academic_id: str
    name: str
    paternal_last_name: str
    maternal_last_name: Optional[str] = None
    email: str
    password: str
    profile_photo: str
    is_admin: bool = False
    super_admin: bool = False
    is_active: bool = True

    @validator("academic_id")
    def validate_academic_id(cls, input):
        is_valid_academic_id(input)
        return input

    @validator("password")
    def validate_password(cls, input):
        is_valid_password(input)
        return input
            
    @validator("email")
    def validate_email(cls, input):
        is_valid_email(input)
        return input
        
    

class TokenRequest(BaseModel):
    token: str

class UserForm(BaseModel):
    username: str
    password: str
    role: str  # Expecting "student" or "admin"