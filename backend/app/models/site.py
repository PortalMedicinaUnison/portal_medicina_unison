from sqlalchemy import Column, Boolean, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType


class SiteTypeEnum(IntEnum):
    HOSPITAL = 1
    CLINIC = 2
    LABORATORY = 3
    OFFICE = 4

class Site(BaseModel):
    __tablename__ = 'sites'
    
    site_id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    name = Column(String(100), nullable=False, unique=True)
    site_type = Column(IntEnumType(SiteTypeEnum), nullable=False)
    address = Column(String(255))
    city = Column(String(50))
    state = Column(String(50))
    country = Column(String(50))
    capacity = Column(Integer)
    contact_name = Column(String(100), nullable=False)
    contact_email = Column(String(50))
    contact_phone = Column(String(15))
    is_available = Column(Boolean, nullable=False, default=True)
    
    admin = relationship("User", back_populates="sites")
    internships = relationship("Internship", back_populates="site")

    def __repr__(self):
        return f"<Site(name={self.name}, site_type={self.site_type.name}, is_available={self.is_available}, is_active={self.is_active})>"
