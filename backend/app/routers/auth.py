from fastapi import APIRouter, BackgroundTasks, status

from controllers import auth as controller
from core.dependencies import CurrentUser, DbSession
from schemas.auth import (
    LoginInput, PasswordResetConfirmInput, PasswordResetOptions, PasswordResetRequestInput,
    PasswordResetTokenInfo, PasswordResetTokenInput, RegisterInput, TokenResponse,
)
from schemas.user import UserOutput

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


@auth_router.post("/login", response_model=TokenResponse)
def login(data: LoginInput, db: DbSession):
    """Inicia sesión y devuelve el token JWT (enviarlo como `Authorization: Bearer <token>`)."""
    return controller.login(db, data)


@auth_router.post("/register", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
def register(data: RegisterInput, db: DbSession):
    """Registro de estudiantes pre-registrados por la coordinación (requiere aceptar el aviso de privacidad)."""
    return controller.register(db, data)


@auth_router.post("/refresh", response_model=TokenResponse)
def refresh(user: CurrentUser):
    """Renueva el token de la sesión actual."""
    return controller.refresh_token(user)


# ----------------------  RESTABLECER CONTRASEÑA (público)  ----------------------

@auth_router.get("/password-reset/options", response_model=PasswordResetOptions)
def password_reset_options():
    """Indica si la recuperación por correo está configurada; si no, la coordinación genera el enlace."""
    return controller.password_reset_options()


@auth_router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(data: PasswordResetRequestInput, db: DbSession, background_tasks: BackgroundTasks):
    """Envía un enlace al correo si la cuenta existe (la respuesta no revela si existe)."""
    controller.request_password_reset(db, data, background_tasks)
    return {"detail": "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."}


@auth_router.post("/password-reset/verify", response_model=PasswordResetTokenInfo)
def verify_password_reset(data: PasswordResetTokenInput, db: DbSession):
    """Comprueba que el enlace siga vigente (el token va en el cuerpo para no quedar en los logs)."""
    return controller.verify_reset_token(db, data.token)


@auth_router.post("/password-reset/confirm", status_code=status.HTTP_204_NO_CONTENT)
def confirm_password_reset(data: PasswordResetConfirmInput, db: DbSession):
    """Guarda la nueva contraseña y cierra todas las sesiones abiertas de la cuenta."""
    controller.confirm_password_reset(db, data)
