from datetime import date
from enum import IntEnum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel
from .types import IntEnumType

if TYPE_CHECKING:
    from .site import Site
    from .user import User


class ReportTypeEnum(IntEnum):
    ACCIDENT = 1
    INSECURE_CONDITION = 2
    WORK_HARASSMENT = 3
    SEXUAL_HARASSMENT = 4
    DISCRIMINATION = 5
    ROBBERY = 6
    OTHER = 7


class Report(BaseModel):
    """Reporte de incidente hecho por un estudiante sobre una sede."""
    __tablename__ = "reports"

    report_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    academic_id: Mapped[str] = mapped_column(String(9), ForeignKey("users.academic_id"), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=False)
    internship_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("internships.internship_id"), nullable=True)
    date_report: Mapped[date] = mapped_column(Date, nullable=False)
    report_type: Mapped[ReportTypeEnum] = mapped_column(IntEnumType(ReportTypeEnum), nullable=False)
    other_type: Mapped[Optional[str]] = mapped_column(String(25), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    anonymity: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_open: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    site: Mapped["Site"] = relationship(lazy="joined")
    student: Mapped["User"] = relationship(lazy="joined", viewonly=True)

    def __repr__(self):
        return f"<Report(report_id={self.report_id}, report_type={self.report_type.name}, is_open={self.is_open})>"
