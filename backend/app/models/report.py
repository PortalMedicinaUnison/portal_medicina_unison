from datetime import date
from sqlalchemy import Boolean, Integer, String, ForeignKey, Text, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship, backref
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType
from .site import Site


class ReportTypeEnum(IntEnum):
    ACCIDENT = 1
    INSECURE_CONDITION = 2
    WORK_HARASSMENT = 3
    SEXUAL_HARASSMENT = 4
    DISCRIMINATION = 5
    ROBBERY = 6
    OTHER = 7

class Report(BaseModel):
    __tablename__ = 'reports'
    
    report_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    academic_id: Mapped[str] = mapped_column(String(9), ForeignKey("users.academic_id", ondelete="CASCADE"), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id", ondelete="RESTRICT"), nullable=False)
    internship_id: Mapped[int] = mapped_column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=True)
    date_report: Mapped[date] = mapped_column(Date, nullable=False)
    report_type: Mapped[ReportTypeEnum] = mapped_column(IntEnumType(ReportTypeEnum), nullable=False)
    other_type: Mapped[str] = mapped_column(String(25), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_url: Mapped[str] = mapped_column(String(255), nullable=True)
    anonymity: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_open: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    site: Mapped["Site"] = relationship("Site", back_populates="reports", lazy="joined")
   
    def __repr__(self):
        return f"<Report(academic_id={self.academic_id}, report_type={self.report_type.name}, is_open={self.is_open})>"