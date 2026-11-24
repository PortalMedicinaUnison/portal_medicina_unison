from typing import List, Optional

from models.report import Report, ReportTypeEnum
from .base import BaseRepo


class ReportRepo(BaseRepo[Report]):
    model = Report

    def list(
        self,
        academic_id: Optional[str] = None,
        site_id: Optional[int] = None,
        internship_id: Optional[int] = None,
        is_open: Optional[bool] = None,
        report_type: Optional[ReportTypeEnum] = None,
    ) -> List[Report]:
        query = self.query()
        if academic_id:
            query = query.filter(Report.academic_id == academic_id)
        if site_id is not None:
            query = query.filter(Report.site_id == site_id)
        if internship_id is not None:
            query = query.filter(Report.internship_id == internship_id)
        if is_open is not None:
            query = query.filter(Report.is_open.is_(is_open))
        if report_type is not None:
            query = query.filter(Report.report_type == report_type)
        return query.order_by(Report.created_at.desc(), Report.report_id.desc()).all()
