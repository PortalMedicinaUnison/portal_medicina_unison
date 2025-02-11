from pydantic import BaseModel, validator
from typing import Optional
from utils.validation import is_valid_academic_id, is_valid_password, is_valid_email


class PreRegisteredUserCreate(BaseModel):
    academic_id: str
    assigned_year: int
    assigned_period: int
    is_active: bool = True

    @validator("academic_id")
    def validate_academic_id(cls, academic_id):
        is_valid_academic_id(academic_id)
        return academic_id

class UserCreate(BaseModel):
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
    def validate_academic_id(cls, academic_id):
        is_valid_academic_id(academic_id)
        return academic_id

    @validator("password")
    def validate_password(cls, password):
        is_valid_password(password)
        return password
            
    @validator("email")
    def validate_email(cls, email):
        is_valid_email(email)
        return email
        
    

# class TokenRequest(BaseModel):
#     token: str

# class UserForm(BaseModel):
#     username: str
#     password: str
#     role: str