from datetime import datetime
from typing import Optional

from sqlalchemy import func

from models.password_reset import PasswordResetToken
from .base import BaseRepo


class PasswordResetTokenRepo(BaseRepo[PasswordResetToken]):
    model = PasswordResetToken

    def get_valid_by_hash(self, token_hash: str, now: datetime) -> Optional[PasswordResetToken]:
        return self.query().filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > now,
        ).first()

    def last_email_request_at(self, user_id: int) -> Optional[datetime]:
        """Fecha del último enlace que el propio usuario pidió por correo (vigente o no)."""
        return (
            self.session.query(func.max(PasswordResetToken.created_at))
            .filter(PasswordResetToken.user_id == user_id, PasswordResetToken.created_by_id.is_(None))
            .scalar()
        )

    def invalidate_for_user(self, user_id: int) -> None:
        """Desactiva los enlaces pendientes del usuario (sin hacer commit)."""
        (
            self.query()
            .filter(PasswordResetToken.user_id == user_id, PasswordResetToken.used_at.is_(None))
            .update({PasswordResetToken.is_active: False}, synchronize_session="fetch")
        )
