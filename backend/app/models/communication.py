from datetime import date
from enum import IntEnum
from typing import Optional

from sqlalchemy import Boolean, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseModel
from .types import IntEnumType


# ----------------------  ANNOUNCEMENT  ----------------------

class AnnouncementTypeEnum(IntEnum):
    GENERAL = 1
    INTERNSHIP = 2


class Announcement(BaseModel):
    __tablename__ = "announcements"

    announcement_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    announcement_type: Mapped[AnnouncementTypeEnum] = mapped_column(IntEnumType(AnnouncementTypeEnum), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<Announcement(title={self.title}, announcement_type={self.announcement_type.name})>"


# ----------------------  SURVEY  ----------------------

class Survey(BaseModel):
    __tablename__ = "surveys"

    survey_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    expiration_date: Mapped[date] = mapped_column(Date, nullable=False)
    mandatory: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<Survey(title={self.title}, mandatory={self.mandatory})>"
