from datetime import datetime, date
from sqlalchemy import Boolean, Integer, String, ForeignKey, Text, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType


# ----------------------  ANNOUCEMENT  ----------------------

class AnnouncementTypeEnum(IntEnum):
    GENERAL = 1
    INTERNSHIP = 2

class Announcement(BaseModel):
    __tablename__ = 'announcements'
    
    announcement_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    announcement_type: Mapped[AnnouncementTypeEnum] = mapped_column(IntEnumType(AnnouncementTypeEnum), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=False)
    
    def __repr__(self):
        return f"<Announcement(created_by={self.created_by}, title={self.title}, announcement_type={self.announcement_type.name})>"

# ----------------------  SURVEY  ----------------------

class Survey(BaseModel):
    __tablename__ = 'surveys'
    
    survey_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    web_link: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    expiration_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    mandatory: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=False)

    def __repr__(self):
        return f"<Survey(created_by={self.created_by}, title={self.title}, mandatory={self.mandatory})>"