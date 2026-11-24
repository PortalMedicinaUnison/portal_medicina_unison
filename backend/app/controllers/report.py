from pathlib import Path, PurePosixPath
from typing import List, Optional, Tuple

from fastapi import UploadFile
from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, not_found
from models.internship import INTERNSHIP_IN_COURSE
from models.report import Report, ReportAttachment, ReportTypeEnum
from models.user import User
from repos.internship import InternshipRepo
from repos.social_service import SocialServiceRepo
from models.social_service import SOCIAL_SERVICE_IN_COURSE
from repos.report import ReportRepo
from repos.site import SiteRepo
from schemas.report import OTHER_TYPE_REQUIRED, ReportInput, ReportOutput, ReportStatusUpdate, ReportUpdate
from utils import file_handlers

MAX_ATTACHMENTS = 5


def _generic_name(index: int, file_path: str) -> str:
    """Nombre de una evidencia que no revela nada del estudiante (para reportes anónimos)."""
    return f"evidencia-{index}{PurePosixPath(file_path).suffix}"


def to_output(report: Report, viewer: User) -> ReportOutput:
    """Si el reporte es anónimo, el personal administrativo no ve quién lo hizo."""
    output = ReportOutput.model_validate(report)
    if viewer.is_staff and report.anonymity:
        # El internado y el servicio social también identifican al estudiante; el nombre de un archivo, también.
        output.academic_id = None
        output.student = None
        output.internship_id = None
        output.social_service_id = None
        for index, (attachment, stored) in enumerate(zip(output.attachments, report.attachments), start=1):
            attachment.original_filename = _generic_name(index, stored.file_path)
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
        if internship.status in INTERNSHIP_IN_COURSE
    ]
    current_social_service = [
        service for service in SocialServiceRepo(db).list(academic_id=student.academic_id)
        if service.status in SOCIAL_SERVICE_IN_COURSE
    ]
    report = Report(
        **data.model_dump(),
        academic_id=student.academic_id,
        internship_id=current[0].internship_id if current else None,
        social_service_id=current_social_service[0].social_service_id if current_social_service else None,
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


# ---------------------- EVIDENCIAS (archivos) ----------------------

def _own_open_report(db: Session, student: User, report_id: int, action: str) -> Report:
    report = get_report(db, student, report_id)
    if not _is_owner(report, student):
        raise not_found("Reporte no encontrado.")
    if not report.is_open:
        raise conflict(f"El reporte está cerrado: ya no se pueden {action} evidencias.")
    return report


def _find_attachment(report: Report, attachment_id: int) -> Tuple[int, ReportAttachment]:
    for index, attachment in enumerate(report.attachments, start=1):
        if attachment.attachment_id == attachment_id:
            return index, attachment
    raise not_found("Archivo no encontrado.")


def add_attachment(db: Session, student: User, report_id: int, file: UploadFile) -> Report:
    """El estudiante adjunta una evidencia (PDF o imagen) a su reporte abierto; hasta MAX_ATTACHMENTS."""
    report = _own_open_report(db, student, report_id, "agregar")
    if len(report.attachments) >= MAX_ATTACHMENTS:
        raise conflict(f"Cada reporte admite hasta {MAX_ATTACHMENTS} archivos de evidencia.")
    path, original_name, media_type, size = file_handlers.save_evidence_upload(file, f"reports/{report.report_id}")
    db.add(ReportAttachment(
        report_id=report.report_id, file_path=path, original_filename=original_name, media_type=media_type, size=size,
    ))
    db.commit()
    db.expire(report, ["attachments"])
    return report


def get_attachment_file(db: Session, user: User, report_id: int, attachment_id: int) -> Tuple[Path, str, str]:
    """Archivo de una evidencia para el estudiante dueño o la coordinación (con nombre genérico si es anónimo)."""
    report = get_report(db, user, report_id)
    index, attachment = _find_attachment(report, attachment_id)
    generic = _generic_name(index, attachment.file_path)
    filename = generic if (user.is_staff and report.anonymity) else (attachment.original_filename or generic)
    return file_handlers.resolve_upload(attachment.file_path), filename, attachment.media_type


def delete_attachment(db: Session, student: User, report_id: int, attachment_id: int) -> Report:
    """El estudiante quita una evidencia de su reporte mientras siga abierto."""
    report = _own_open_report(db, student, report_id, "quitar")
    _, attachment = _find_attachment(report, attachment_id)
    attachment.is_active = False
    db.commit()
    file_handlers.delete_upload(attachment.file_path)
    db.expire(report, ["attachments"])
    return report

