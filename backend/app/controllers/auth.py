import hashlib
import secrets
from datetime import timedelta
from typing import Optional

from fastapi import BackgroundTasks
from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, forbidden, unauthorized
from core.security import create_access_token, hash_password, verify_password
from core.settings import settings
from models.base import utcnow
from models.password_reset import PasswordResetToken
from models.user import User
from repos.password_reset import PasswordResetTokenRepo
from repos.user import UserEnrollmentRepo, UserRepo
from schemas.auth import (
    LoginInput, PasswordResetConfirmInput, PasswordResetLinkOutput, PasswordResetOptions,
    PasswordResetRequestInput, PasswordResetTokenInfo, RegisterInput, TokenResponse,
)
from utils import mailer

INVALID_RESET_LINK = "El enlace para restablecer la contraseña no es válido o ya expiró. Pide uno nuevo."
# Un mismo usuario no recibe más de un correo de recuperación en este lapso.
EMAIL_RESET_COOLDOWN = timedelta(minutes=5)


def session_token(user: User) -> TokenResponse:
    return TokenResponse(access_token=create_access_token(user.user_id, user.token_version))


def login(db: Session, data: LoginInput) -> TokenResponse:
    user = UserRepo(db).get_by_email(data.email)
    if not verify_password(data.password, user.password if user else None):
        raise unauthorized("Correo o contraseña incorrectos.")
    return session_token(user)


def register(db: Session, data: RegisterInput) -> User:
    """Crea la cuenta de un estudiante pre-registrado. Nunca crea administradores."""
    users = UserRepo(db)
    enrollment = UserEnrollmentRepo(db).get_by_academic_id(data.academic_id)
    if enrollment is None:
        raise bad_request("Tu expediente no está pre-registrado. Contacta a la coordinación del internado.")
    if users.get_by_academic_id(data.academic_id, include_inactive=True):
        raise conflict("Ya existe una cuenta con este expediente.")
    if users.get_by_email(data.email, include_inactive=True):
        raise conflict("Ya existe una cuenta con este correo.")

    user = User(
        academic_id=data.academic_id,
        first_name=data.first_name,
        last_name=data.last_name,
        second_last_name=data.second_last_name,
        email=data.email,
        phone_number=data.phone_number,
        password=hash_password(data.password),
        is_admin=False,
        is_super_admin=False,
        privacy_notice_version=settings.PRIVACY_NOTICE_VERSION,
        privacy_accepted_at=utcnow(),
    )
    db.add(user)
    enrollment.is_enrolled = True
    db.commit()
    db.refresh(user)
    return user


def refresh_token(user: User) -> TokenResponse:
    return session_token(user)


# ---------------------- CONTRASEÑA ----------------------

def set_password(db: Session, user: User, new_password: str) -> None:
    """
    Guarda la nueva contraseña, cierra las demás sesiones (sube token_version) e
    invalida los enlaces de restablecimiento pendientes.
    """
    PasswordResetTokenRepo(db).invalidate_for_user(user.user_id)
    UserRepo(db).update(user, {"password": hash_password(new_password), "token_version": user.token_version + 1})


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _issue_reset_token(db: Session, user: User, lifetime: timedelta, created_by: Optional[User] = None) -> tuple:
    """Crea un enlace de un solo uso (en la BD solo queda su hash); los anteriores dejan de servir."""
    repo = PasswordResetTokenRepo(db)
    repo.invalidate_for_user(user.user_id)
    token = secrets.token_urlsafe(32)
    reset = repo.add(PasswordResetToken(
        user_id=user.user_id,
        token_hash=_hash_token(token),
        expires_at=utcnow() + lifetime,
        created_by_id=created_by.user_id if created_by else None,
    ))
    return token, reset


def create_reset_link(db: Session, actor: User, target: User) -> PasswordResetLinkOutput:
    """La coordinación genera un enlace para que el usuario cree una contraseña nueva (sin correo)."""
    if target.is_staff and not actor.is_super_admin and target.user_id != actor.user_id:
        raise forbidden("Solo un super administrador puede restablecer la contraseña de otros administradores.")
    if not target.is_active:
        raise conflict("La cuenta está desactivada. Reactívala antes de restablecer la contraseña.")
    token, reset = _issue_reset_token(db, target, timedelta(hours=settings.PASSWORD_RESET_HOURS), created_by=actor)
    return PasswordResetLinkOutput(token=token, expires_at=reset.expires_at)


def password_reset_options() -> PasswordResetOptions:
    return PasswordResetOptions(
        email_enabled=settings.email_enabled, email_link_minutes=settings.PASSWORD_RESET_EMAIL_MINUTES,
    )


def request_password_reset(db: Session, data: PasswordResetRequestInput, background_tasks: BackgroundTasks) -> None:
    """
    Envía el enlace por correo si la cuenta existe. La respuesta es la misma exista o no,
    para no revelar qué correos están registrados; el correo sale en segundo plano.
    """
    if not settings.email_enabled:
        raise bad_request(
            "La recuperación por correo no está disponible. Pide a la coordinación un enlace para restablecer tu contraseña."
        )
    user = UserRepo(db).get_by_email(data.email)
    if user is None:
        return
    last_request = PasswordResetTokenRepo(db).last_email_request_at(user.user_id)
    if last_request and utcnow() - last_request < EMAIL_RESET_COOLDOWN:
        return

    minutes = settings.PASSWORD_RESET_EMAIL_MINUTES
    token, _reset = _issue_reset_token(db, user, timedelta(minutes=minutes))
    link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={token}"
    body = (
        f"Hola, {user.first_name}:\n\n"
        "Recibimos una solicitud para restablecer la contraseña de tu cuenta en el portal de "
        "Internado y Servicio Social de Medicina de la Universidad de Sonora.\n\n"
        f"Para crear una contraseña nueva abre este enlace (vence en {minutes} minutos y solo se puede usar una vez):\n"
        f"{link}\n\n"
        "Si no fuiste tú, ignora este correo: tu contraseña no cambiará.\n"
    )
    background_tasks.add_task(mailer.send_email, user.email, "Restablecer contraseña - Portal de Medicina Unison", body)


def _get_valid_reset(db: Session, token: str) -> tuple:
    reset = PasswordResetTokenRepo(db).get_valid_by_hash(_hash_token(token), utcnow()) if token else None
    user = db.get(User, reset.user_id) if reset else None
    if reset is None or user is None or not user.is_active:
        raise bad_request(INVALID_RESET_LINK)
    return reset, user


def verify_reset_token(db: Session, token: str) -> PasswordResetTokenInfo:
    reset, user = _get_valid_reset(db, token)
    return PasswordResetTokenInfo(email=user.email, expires_at=reset.expires_at)


def confirm_password_reset(db: Session, data: PasswordResetConfirmInput) -> None:
    reset, user = _get_valid_reset(db, data.token)
    reset.used_at = utcnow()
    db.flush()
    set_password(db, user, data.new_password)
