from datetime import date
from sqlalchemy import Boolean, Integer, String, ForeignKey, Text, Date
from sqlalchemy.orm import Mapped, mapped_column
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType


class ReportTypeEnum(IntEnum):
    ACCIDENT = 1
    WORK_HARASSMENT = 2
    SEXUAL_HARASSMENT = 3

class Report(BaseModel):
    __tablename__ = 'reports'
    
    report_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    internship_id: Mapped[int] = mapped_column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id", ondelete="RESTRICT"), nullable=False)
    date_report: Mapped[date] = mapped_column(Date, nullable=False)
    report_type: Mapped[ReportTypeEnum] = mapped_column(IntEnumType(ReportTypeEnum), nullable=False)
    other_type: Mapped[str] = mapped_column(String(25))
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[str] = mapped_column(String(255))
    anonymity: Mapped[bool] = mapped_column(Boolean, nullable=False)
    is_open: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    admin_comment: Mapped[str] = mapped_column(Text)
   
    def __repr__(self):
        return f"<Report(student_id={self.student_id}, type={self.report_type.name}, is_open={self.is_open})>"