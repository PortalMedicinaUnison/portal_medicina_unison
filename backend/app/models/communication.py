from datetime import datetime, date
from sqlalchemy import Boolean, Integer, String, ForeignKey, Text, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType


# ---------------  Announcement  ----------------------

class AnnouncementTypeEnum(IntEnum):
    GENERAL = 1
    INTERNSHIP = 2

class Announcement(BaseModel):
    __tablename__ = 'announcements'
    
    announcement_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    announcement_type: Mapped[AnnouncementTypeEnum] = mapped_column(IntEnumType(AnnouncementTypeEnum), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=False)
    
    def __repr__(self):
        return f"<Announcement(created_by={self.created_by}, title={self.title}, announcement_type={self.announcement_type.name})>"


# ---------------  Survey  ----------------------

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

# ---------------  Report  ----------------------

class ReportTypeEnum(IntEnum):
    INCIDENT = 1
    SUGGESTION = 2
    COMPLAINT = 3
    OTHER = 4

class Report(BaseModel):
    __tablename__ = 'reports'
    
    report_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    internship_id: Mapped[int] = mapped_column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id", ondelete="RESTRICT"), nullable=False)
    date_report: Mapped[date] = mapped_column(Date, nullable=False)
    report_type: Mapped[ReportTypeEnum] = mapped_column(IntEnumType(ReportTypeEnum), nullable=False)
    other_type: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[str] = mapped_column(String(255))
    anonymity: Mapped[bool] = mapped_column(Boolean, nullable=False)
    is_open: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    admin_comment: Mapped[str] = mapped_column(Text)
   
   
    def __repr__(self):
        return f"<Report(student_id={self.student_id}, type={self.report_type.name}, is_open={self.is_open})>"