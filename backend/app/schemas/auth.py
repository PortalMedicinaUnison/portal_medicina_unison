from typing import Annotated

from pydantic import BaseModel, BeforeValidator

from schemas.common import AcademicId, Email, OptionalStr, Password, Phone, RequiredStr

NormalizedEmail = Annotated[str, BeforeValidator(lambda v: v.strip().lower() if isinstance(v, str) else v)]


class LoginInput(BaseModel):
    email: NormalizedEmail
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterInput(BaseModel):
    """Registro de estudiantes. El expediente debe estar pre-registrado por un administrador."""
    academic_id: AcademicId
    first_name: RequiredStr(50)
    last_name: RequiredStr(50)
    second_last_name: OptionalStr(50) = None
    email: Email
    phone_number: Phone = None
    password: Password
