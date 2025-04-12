from pydantic import BaseModel, field_validator
from typing import Optional
from utils.validation import is_valid_academic_id, is_valid_password, is_valid_email


class PreRegisteredUserInput(BaseModel):
    academic_id: str
    assigned_year: int
    assigned_period: int

    @field_validator("academic_id")
    def validate_academic_id(cls, academic_id):
        is_valid_academic_id(academic_id)
        return academic_id

class PreRegisteredUserInputUpdate(BaseModel):
    academic_id: Optional[str]
    assigned_year: Optional[int]
    assigned_period: Optional[int]

    @field_validator("academic_id")
    def validate_academic_id(cls, academic_id):
        is_valid_academic_id(academic_id)
        return academic_id
    
class UserInput(BaseModel):
    academic_id: str
    first_name: str
    last_name: str
    second_last_name: Optional[str] = None
    email: str
    password: Optional[str] = None
    profile_photo: str
    is_admin: bool = False
    is_super_admin: bool = False

    @field_validator("academic_id")
    def validate_academic_id(cls, academic_id):
        is_valid_academic_id(academic_id)
        return academic_id

    @field_validator("password")
    def validate_password(cls, password):
        is_valid_password(password)
        return password
            
    @field_validator("email")
    def validate_email(cls, email):
        is_valid_email(email)
        return email

class UserInputUpdate(BaseModel):
    academic_id: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    second_last_name: Optional[str] = None
    email: Optional[str]
    password: Optional[str]
    profile_photo: Optional[str]
    is_admin: Optional[bool] = False
    is_super_admin: Optional[bool] = False

    @field_validator("academic_id")
    def validate_academic_id(cls, academic_id):
        is_valid_academic_id(academic_id)
        return academic_id

    @field_validator("password")
    def validate_password(cls, password):
        is_valid_password(password)
        return password
            
    @field_validator("email")
    def validate_email(cls, email):
        is_valid_email(email)
        return email
