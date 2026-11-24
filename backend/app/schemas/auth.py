from typing import Annotated

from pydantic import BaseModel, BeforeValidator, model_validator

from schemas.common import AcademicId, Email, OptionalStr, Password, Phone, RequiredStr, UTCDateTime

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
    accept_privacy_notice: bool = False

    @model_validator(mode="after")
    def privacy_notice_required(self):
        if not self.accept_privacy_notice:
            raise ValueError("Debes aceptar el aviso de privacidad para crear tu cuenta.")
        return self


# ---------------------- RESTABLECER CONTRASEÑA ----------------------

class PasswordResetOptions(BaseModel):
    email_enabled: bool
    email_link_minutes: int


class PasswordResetRequestInput(BaseModel):
    email: NormalizedEmail


class PasswordResetTokenInput(BaseModel):
    token: str


class PasswordResetTokenInfo(BaseModel):
    """Para mostrar a quién pertenece el enlace antes de escribir la nueva contraseña."""
    email: str
    expires_at: UTCDateTime


class PasswordResetConfirmInput(BaseModel):
    token: str
    new_password: Password
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Las contraseñas no coinciden.")
        return self


class PasswordResetLinkOutput(BaseModel):
    """Token de un solo uso que la coordinación comparte con el usuario (el frontend arma el enlace)."""
    token: str
    expires_at: UTCDateTime
