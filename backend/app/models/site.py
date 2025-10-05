from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import BaseModel
from typing import TYPE_CHECKING
from typing import List

if TYPE_CHECKING:
    from .promotion import PromotionSiteDetail

# ----------------------  INSTITUTION  ----------------------

class Institution(BaseModel):
    __tablename__ = 'institutions'
    
    institution_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    sites: Mapped[List["Site"]] = relationship(back_populates="institution")

    def __repr__(self):
        return f"<Institution(name={self.name}, is_active={self.is_active})>"

# ----------------------  SITE  ----------------------

class Site(BaseModel):
    __tablename__ = 'sites'

    # teaching_head se refiere al jefe de enseñanza de la sede
    # teaching_deputy se refiere al subjefe de enseñanza de la sede
    
    site_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    institution_id: Mapped[int] = mapped_column(Integer, ForeignKey("institutions.institution_id"), nullable=False)
    address: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(50))
    teaching_head_name: Mapped[str] = mapped_column(String(100), nullable=False)
    teaching_head_email: Mapped[str] = mapped_column(String(50), nullable=True)
    teaching_head_phone: Mapped[str] = mapped_column(String(15), nullable=True)
    teaching_deputy_name: Mapped[str] = mapped_column(String(100), nullable=True)
    teaching_deputy_email: Mapped[str] = mapped_column(String(50), nullable=True)
    teaching_deputy_phone: Mapped[str] = mapped_column(String(15), nullable=True)

    promotion_details: Mapped[List["PromotionSiteDetail"]] = relationship(back_populates="site")
    institution: Mapped["Institution"] = relationship(back_populates="sites", lazy="joined")

    def __repr__(self):
        return f"<Site(name={self.name}, institution_id={self.institution_id}, is_active={self.is_active})>"
