from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel

if TYPE_CHECKING:
    from .promotion import PromotionSiteDetail


# ----------------------  INSTITUTION  ----------------------

class Institution(BaseModel):
    __tablename__ = "institutions"

    institution_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    sites: Mapped[List["Site"]] = relationship(back_populates="institution")

    def __repr__(self):
        return f"<Institution(name={self.name}, is_active={self.is_active})>"


# ----------------------  SITE  ----------------------

class Site(BaseModel):
    """
    Sede donde se realiza el internado.
    teaching_head: jefe de enseñanza de la sede; teaching_deputy: subjefe de enseñanza.
    """
    __tablename__ = "sites"

    site_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    institution_id: Mapped[int] = mapped_column(Integer, ForeignKey("institutions.institution_id"), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    teaching_head_name: Mapped[str] = mapped_column(String(100), nullable=False)
    teaching_head_email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    teaching_head_phone: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    teaching_deputy_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    teaching_deputy_email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    teaching_deputy_phone: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)

    institution: Mapped["Institution"] = relationship(back_populates="sites", lazy="joined")
    promotion_details: Mapped[List["PromotionSiteDetail"]] = relationship(back_populates="site")

    def __repr__(self):
        return f"<Site(name={self.name}, institution_id={self.institution_id}, is_active={self.is_active})>"
