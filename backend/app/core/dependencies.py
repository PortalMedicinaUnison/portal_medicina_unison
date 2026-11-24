from typing import Annotated, Generator, Optional

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from core.errors import forbidden, unauthorized
from core.security import decode_access_token
from db.database import SessionLocal
from models.user import User

bearer_scheme = HTTPBearer(auto_error=False, description="Token JWT obtenido en /auth/login")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DbSession,
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(bearer_scheme)],
) -> User:
    if credentials is None:
        raise unauthorized()
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise unauthorized("Tu sesión no es válida o expiró. Inicia sesión de nuevo.")
    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise unauthorized("Tu sesión no es válida o expiró. Inicia sesión de nuevo.")
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise unauthorized("Tu cuenta no existe o está desactivada.")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_admin(user: CurrentUser) -> User:
    if not user.is_staff:
        raise forbidden()
    return user


def require_super_admin(user: CurrentUser) -> User:
    if not user.is_super_admin:
        raise forbidden("Solo un super administrador puede realizar esta acción.")
    return user


def require_student(user: CurrentUser) -> User:
    if user.is_staff or not user.academic_id:
        raise forbidden("Esta acción es solo para estudiantes.")
    return user


AdminUser = Annotated[User, Depends(require_admin)]
SuperAdminUser = Annotated[User, Depends(require_super_admin)]
StudentUser = Annotated[User, Depends(require_student)]
