from typing import List, Optional

from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, not_found
from models.internship import InternshipStatusEnum
from models.report import Report, ReportTypeEnum
from models.user import User
from repos.internship import InternshipRepo
from repos.report import ReportRepo
from repos.site import SiteRepo
from schemas.report import OTHER_TYPE_REQUIRED, ReportInput, ReportOutput, ReportStatusUpdate, ReportUpdate


def to_output(report: Report, viewer: User) -> ReportOutput:
    """Si el reporte es anónimo, el personal administrativo no ve quién lo hizo."""
    output = ReportOutput.model_validate(report)
    if viewer.is_staff and report.anonymity:
        # El internado también identifica al estudiante (GET /internships/{id}).
        output.academic_id = None
        output.student = None
        output.internship_id = None
    return output


def _is_owner(report: Report, user: User) -> bool:
    return not user.is_staff and report.academic_id == user.academic_id


def _check_site(db: Session, site_id: int) -> None:
    if SiteRepo(db).get(site_id) is None:
        raise bad_request("La sede seleccionada no existe.")


def list_reports(
    db: Session, user: User,
    academic_id: Optional[str], site_id: Optional[int], internship_id: Optional[int],
    is_open: Optional[bool], report_type: Optional[ReportTypeEnum],
) -> List[ReportOutput]:
    scoped_academic_id = academic_id if user.is_staff else user.academic_id
    reports = ReportRepo(db).list(
        academic_id=scoped_academic_id, site_id=site_id, internship_id=internship_id,
        is_open=is_open, report_type=report_type,
    )
    if user.is_staff and (academic_id or internship_id is not None):
        # Filtrar por estudiante o por internado no debe revelar a quién pertenecen los reportes anónimos.
        reports = [report for report in reports if not report.anonymity]
    return [to_output(report, user) for report in reports]


def get_report(db: Session, user: User, report_id: int) -> Report:
    report = ReportRepo(db).get(report_id)
    if report is None or not (user.is_staff or _is_owner(report, user)):
        raise not_found("Reporte no encontrado.")
    return report


def create_report(db: Session, student: User, data: ReportInput) -> Report:
    _check_site(db, data.site_id)
    current = [
        internship for internship in InternshipRepo(db).list(academic_id=student.academic_id)
        if internship.status != InternshipStatusEnum.FINISHED
    ]
    report = Report(
        **data.model_dump(),
        academic_id=student.academic_id,
        internship_id=current[0].internship_id if current else None,
    )
    return ReportRepo(db).add(report)


def update_report(db: Session, user: User, report_id: int, data: ReportUpdate) -> Report:
    report = get_report(db, user, report_id)
    if not _is_owner(report, user):
        raise not_found("Reporte no encontrado.")
    if not report.is_open:
        raise conflict("El reporte está cerrado y ya no se puede editar.")
    payload = data.model_dump(exclude_unset=True)
    if "site_id" in payload:
        _check_site(db, payload["site_id"])
    report_type = payload.get("report_type", report.report_type)
    other_type = payload.get("other_type", report.other_type)
    if report_type == ReportTypeEnum.OTHER and not other_type:
        raise bad_request(OTHER_TYPE_REQUIRED)
    if report_type != ReportTypeEnum.OTHER:
        payload["other_type"] = None
    return ReportRepo(db).update(report, payload)


def set_report_status(db: Session, user: User, report_id: int, data: ReportStatusUpdate) -> Report:
    report = get_report(db, user, report_id)
    return ReportRepo(db).update(report, {"is_open": data.is_open})


def delete_report(db: Session, user: User, report_id: int) -> None:
    report = get_report(db, user, report_id)
    if _is_owner(report, user) and not report.is_open:
        raise conflict("El reporte está cerrado y ya no se puede eliminar.")
    ReportRepo(db).soft_delete(report)
