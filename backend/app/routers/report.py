from typing import List, Optional

from fastapi import APIRouter, status

from controllers import report as controller
from core.dependencies import AdminUser, CurrentUser, DbSession, StudentUser
from models.report import ReportTypeEnum
from schemas.report import ReportInput, ReportOutput, ReportStatusUpdate, ReportUpdate

report_router = APIRouter(prefix="/reports", tags=["Reportes"])


@report_router.get("", response_model=List[ReportOutput])
def list_reports(
    user: CurrentUser, db: DbSession,
    academic_id: Optional[str] = None, site_id: Optional[int] = None, internship_id: Optional[int] = None,
    is_open: Optional[bool] = None, report_type: Optional[ReportTypeEnum] = None,
):
    """Administradores: todos (los anónimos sin datos del estudiante). Estudiantes: solo los suyos."""
    return controller.list_reports(
        db, user, academic_id=academic_id, site_id=site_id, internship_id=internship_id,
        is_open=is_open, report_type=report_type,
    )


@report_router.post("", response_model=ReportOutput, status_code=status.HTTP_201_CREATED)
def create_report(data: ReportInput, student: StudentUser, db: DbSession):
    return controller.to_output(controller.create_report(db, student, data), student)


@report_router.get("/{report_id}", response_model=ReportOutput)
def get_report(report_id: int, user: CurrentUser, db: DbSession):
    return controller.to_output(controller.get_report(db, user, report_id), user)


@report_router.patch("/{report_id}", response_model=ReportOutput)
def update_report(report_id: int, data: ReportUpdate, student: StudentUser, db: DbSession):
    """El estudiante edita su reporte mientras siga abierto."""
    return controller.to_output(controller.update_report(db, student, report_id, data), student)


@report_router.patch("/{report_id}/status", response_model=ReportOutput)
def set_report_status(report_id: int, data: ReportStatusUpdate, admin: AdminUser, db: DbSession):
    """La coordinación abre o cierra el reporte."""
    return controller.to_output(controller.set_report_status(db, admin, report_id, data), admin)


@report_router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(report_id: int, user: CurrentUser, db: DbSession):
    controller.delete_report(db, user, report_id)
