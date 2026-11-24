from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseModel


# ----------------------  USER ENROLLMENT  ----------------------

class UserEnrollment(BaseModel):
    """
    Estudiantes pre-registrados por el administrador. Solo un expediente
    pre-registrado y activo puede crear una cuenta en el portal.
    """
    __tablename__ = "user_enrollments"
    __table_args__ = (Index("idx_user_enrollment_academic_id", "academic_id"),)

    enrollment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    academic_id: Mapped[str] = mapped_column(String(9), unique=True, nullable=False)
    is_enrolled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self):
        return f"<UserEnrollment(academic_id={self.academic_id}, is_enrolled={self.is_enrolled}, is_active={self.is_active})>"


# ----------------------  USER  ----------------------

class User(BaseModel):
    """
    Usuarios del portal. Los estudiantes tienen expediente (academic_id);
    los administradores pueden no tenerlo.
    """
    __tablename__ = "users"
    __table_args__ = (Index("idx_user_email", "email"),)

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    academic_id: Mapped[Optional[str]] = mapped_column(
        String(9), ForeignKey("user_enrollments.academic_id"), unique=True, nullable=True
    )
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    second_last_name: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    profile_photo: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_super_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # Cambia al cambiar o restablecer la contraseña: invalida las sesiones (tokens) anteriores.
    token_version: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    # Versión del aviso de privacidad aceptada y cuándo.
    privacy_notice_version: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    privacy_accepted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    @property
    def role(self) -> str:
        if self.is_super_admin:
            return "super_admin"
        if self.is_admin:
            return "admin"
        return "student"

    @property
    def has_photo(self) -> bool:
        return bool(self.profile_photo)

    @property
    def is_staff(self) -> bool:
        """Administrador o super administrador."""
        return self.is_admin or self.is_super_admin

    def __repr__(self):
        return f"<User(user_id={self.user_id}, email={self.email}, role={self.role}, is_active={self.is_active})>"
