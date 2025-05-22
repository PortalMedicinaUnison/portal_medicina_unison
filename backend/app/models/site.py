from typing import Optional
from sqlalchemy import Boolean, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType


class Institution(BaseModel):
    __tablename__ = 'institutions'
    
    institution_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    
    def __repr__(self):
        return f"<Institution(name={self.name}, is_active={self.is_active}>"


class SiteTypeEnum(IntEnum):
    HOSPITAL = 1
    CLINIC = 2
    LABORATORY = 3
    OFFICE = 4

class Site(BaseModel):
    __tablename__ = 'sites'
    
    site_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    institution_id: Mapped[int] = mapped_column(Integer, ForeignKey("institutions.institution_id"), nullable=False)
    site_type: Mapped[SiteTypeEnum] = mapped_column(IntEnumType(SiteTypeEnum), nullable=False)
    address: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(50))
    state: Mapped[str] = mapped_column(String(50))
    capacity: Mapped[int] = mapped_column(Integer)
    director: Mapped[str] = mapped_column(String(100), nullable=False)
    subdirector: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(50))
    contact_phone: Mapped[str] = mapped_column(String(15))
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_by: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)

    def __repr__(self):
        return f"<Site(name={self.name}, site_type={self.site_type.name}, is_available={self.is_available}, is_active={self.is_active})>"
