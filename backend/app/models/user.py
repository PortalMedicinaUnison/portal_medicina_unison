from typing import Optional
from sqlalchemy import Boolean, Integer, String, Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel

    
class PreRegisteredUser(BaseModel):
    """
    Estudiantes inscritos por el administrador habilitados para registrarse
    en el portal. De esta manera solo los estudiantes que cumplen con los
    requisitos pueden registrarse.
    """
    __tablename__ = "pre_registered_users"
    __table_args__ = (Index('idx_pre_registered_academic_id', 'academic_id'),)

    pre_registered_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    academic_id: Mapped[str] = mapped_column(String(9), unique=True, nullable=False)
    assigned_year: Mapped[int] = mapped_column(Integer, nullable=False)
    assigned_period: Mapped[int] = mapped_column(Integer, nullable=False)

    def __repr__(self):
        return f"<PreRegisteredUser(academic_id={self.academic_id}, assigned_year={self.assigned_year}, is_active={self.is_active})>"

class User(BaseModel):
    __tablename__ = 'users'
    __table_args__ = (Index('idx_user_email', 'email'),)
    
    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    academic_id: Mapped[str] = mapped_column(String(9), ForeignKey("pre_registered_users.academic_id", ondelete="CASCADE"), unique=True, nullable=False)
    internship_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("internships.internship_id", ondelete="RESTRICT"), nullable=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    second_last_name: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    profile_photo: Mapped[str] = mapped_column(String(255), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_super_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self):
        return f"<User(name={self.first_name}, email={self.email}, is_admin={self.is_admin}, is_active={self.is_active})>"