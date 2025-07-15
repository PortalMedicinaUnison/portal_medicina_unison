from typing import Optional
from sqlalchemy import Boolean, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from enum import IntEnum
from .base import BaseModel


class Institution(BaseModel):
    __tablename__ = 'institutions'
    
    institution_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    
    def __repr__(self):
        return f"<Institution(name={self.name}, is_active={self.is_active})>"


class Site(BaseModel):
    __tablename__ = 'sites'

    # teaching_head se refiere al jefe de enseñanza de la sede
    # teaching_deputy se refiere al subjefe de enseñanza de la sede
    
    site_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    institution_id: Mapped[int] = mapped_column(Integer, ForeignKey("institutions.institution_id"), nullable=False)
    address: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(50))
    capacity: Mapped[int] = mapped_column(Integer)
    teaching_head_name: Mapped[str] = mapped_column(String(100), nullable=False)
    teaching_head_email: Mapped[str] = mapped_column(String(50), nullable=True)
    teaching_head_phone: Mapped[str] = mapped_column(String(15), nullable=True)
    teaching_deputy_name: Mapped[str] = mapped_column(String(100), nullable=True)
    teaching_deputy_email: Mapped[str] = mapped_column(String(50), nullable=True)
    teaching_deputy_phone: Mapped[str] = mapped_column(String(15), nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def __repr__(self):
        return f"<Site(name={self.name}, capacity={self.capacity}, is_available={self.is_available}, is_active={self.is_active})>"
