from typing import List, Optional

from pydantic import BaseModel, Field, model_validator

from schemas.common import AcademicId, Email, OptionalStr, ORMModel, Password, Phone, RequiredStr, UTCDateTime


# ---------------------- USER ENROLLMENTS ----------------------

class EnrollmentInput(BaseModel):
    academic_id: AcademicId


class EnrollmentBulkInput(BaseModel):
    academic_ids: List[str] = Field(min_length=1, max_length=2000)


class EnrollmentBulkResult(BaseModel):
    created: List[str]
    skipped: List[str]
    invalid: List[str]


class EnrollmentUpdate(BaseModel):
    is_enrolled: bool = None


class EnrollmentOutput(ORMModel):
    enrollment_id: int
    academic_id: str
    is_enrolled: bool
    created_at: UTCDateTime
    updated_at: UTCDateTime


# ---------------------- USERS ----------------------

class UserBasicOutput(ORMModel):
    user_id: int
    academic_id: Optional[str] = None
    first_name: str
    last_name: str
    second_last_name: Optional[str] = None
    email: str


class UserOutput(ORMModel):
    user_id: int
    academic_id: Optional[str] = None
    first_name: str
    last_name: str
    second_last_name: Optional[str] = None
    email: str
    phone_number: Optional[str] = None
    profile_photo: Optional[str] = None
    is_admin: bool
    is_super_admin: bool
    role: str
    is_active: bool
    created_at: UTCDateTime


class UserUpdate(BaseModel):
    """Datos de perfil editables (por el propio usuario o por un administrador)."""
    first_name: RequiredStr(50) = None
    last_name: RequiredStr(50) = None
    second_last_name: OptionalStr(50) = None
    email: Email = None
    phone_number: Phone = None


class UserRoleUpdate(BaseModel):
    is_admin: bool


class PasswordChangeInput(BaseModel):
    current_password: str
    new_password: Password
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Las contraseñas no coinciden.")
        return self
