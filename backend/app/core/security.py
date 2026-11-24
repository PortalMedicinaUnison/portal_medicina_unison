from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt

from core.settings import settings

# Hash válido de una contraseña cualquiera: se usa para que el login tarde lo mismo
# exista o no el usuario (evita adivinar correos registrados por tiempo de respuesta).
_DUMMY_HASH = bcrypt.hashpw(b"dummy-password", bcrypt.gensalt()).decode()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed_password: Optional[str]) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), (hashed_password or _DUMMY_HASH).encode("utf-8")) and bool(hashed_password)
    except ValueError:
        return False


def create_access_token(user_id: int, token_version: int = 0, expires_delta: Optional[timedelta] = None) -> str:
    """`ver` es la versión de la contraseña: si el usuario la cambia, este token deja de servir."""
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"sub": str(user_id), "ver": token_version, "iat": now, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Devuelve el payload si el token es válido y no ha expirado; si no, None."""
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"require": ["sub", "exp"]},
        )
    except jwt.InvalidTokenError:
        return None
