from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.communication import AnnouncementInput, SurveyInput, AnnouncementTypeEnum
from schemas.report import ReportInput, ReportInputUpdate, ReportOutput
from core.dependencies import get_db
from controllers.communication import (
    create_announcement,
    get_announcement,
    get_announcements_by_type,
    update_announcement,
    delete_announcement,
    create_survey,
    update_survey,
    get_survey,
    get_surveys_by_mandatory,
    update_survey,
    delete_survey
)
from controllers.report import (
    create_report,
    get_report,
    get_all_student_reports,
    update_report,
    toggle_report_status,
    get_report_by_internship,
    get_report_by_site
)

# ----------------------  Announcement  ----------------------

announcement_router = APIRouter(prefix="/announcements", tags=["Avisos"])

@announcement_router.post('/', response_model=AnnouncementInput)
async def create_announcement_route(announcement: AnnouncementInput, db: Session = Depends(get_db)):
    announcement = create_announcement(announcement, db)
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar el aviso")
    return announcement

@announcement_router.get('/{announcement_id}', response_model=AnnouncementInput)
async def get_announcement_route(announcement_id: int, db: Session = Depends(get_db)):
    announcement = get_announcement(announcement_id, db)
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return announcement

@announcement_router.get('/', response_model=List[AnnouncementInput])
async def get_announcements_by_type_route(announcement_type: AnnouncementTypeEnum, db: Session = Depends(get_db)):
    announcements = get_announcements_by_type(announcement_type, db)
    if not announcements:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return announcements

@announcement_router.patch('/{announcement_id}', response_model=AnnouncementInput)
async def update_announcement_route(announcement_id: int, announcement: AnnouncementInput, db: Session = Depends(get_db)):
    announcement = update_announcement(announcement_id, announcement, db)
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return announcement

@announcement_router.delete('/{announcement_id}')
async def delete_announcement_route(announcement_id: int, db: Session = Depends(get_db)):
    announcement = delete_announcement(announcement_id, db)
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return announcement


# ----------------------  Survey  ----------------------

survey_router = APIRouter(prefix="/surveys", tags=["Encuestas"])

@survey_router.post('/', response_model=SurveyInput)
async def create_survey_route(survey: SurveyInput, db: Session = Depends(get_db)):
    survey = create_survey(survey, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar la encuesta")
    return survey

@survey_router.get('/{survey_id}', response_model=SurveyInput)
async def get_survey_route(survey_id: int, db: Session = Depends(get_db)):
    survey = get_survey(survey_id, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return survey

@survey_router.get('/', response_model=List[SurveyInput])
async def get_surveys_by_mandatory_route(mandatory: bool, db: Session = Depends(get_db)):
    surveys = get_surveys_by_mandatory(mandatory, db)
    if not surveys:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return surveys

@survey_router.patch('/{survey_id}', response_model=SurveyInput)
async def update_survey_route(survey_id: int, survey: SurveyInput, db: Session = Depends(get_db)):
    survey = update_survey(survey_id, survey, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return survey

@survey_router.delete('/{survey_id}')
async def delete_survey_route(survey_id: int, db: Session = Depends(get_db)):
    survey = delete_survey(survey_id, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return survey


# ----------------------  Report  ----------------------

report_router = APIRouter(prefix="/reports", tags=["Reportes"])

@report_router.post('/', response_model=ReportOutput, status_code=status.HTTP_201_CREATED)
async def create_report_route(
    report: ReportInput, 
    student_id: int,  # TODO: Obtener del token de autenticación
    db: Session = Depends(get_db)
):
    """Crear un nuevo reporte"""
    created_report = create_report(report, student_id, db)
    if not created_report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el reporte")
    return created_report

@report_router.get('/{report_id}', response_model=ReportOutput)
async def get_report_route(
    report_id: int, 
    student_id: int,  # TODO: Obtener del token de autenticación
    db: Session = Depends(get_db)
):
    """Obtener un reporte específico del estudiante"""
    report = get_report(report_id, student_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

@report_router.get('/', response_model=List[ReportOutput])
async def get_student_reports_route(
    student_id: int,  # TODO: Obtener del token de autenticación
    db: Session = Depends(get_db)
):
    """Obtener todos los reportes del estudiante"""
    reports = get_all_student_reports(student_id, db)
    if not reports:
        return []
    return reports

@report_router.patch('/{report_id}', response_model=ReportOutput)
async def update_report_route(
    report_id: int, 
    report_update: ReportInputUpdate, 
    student_id: int,  # TODO: Obtener del token de autenticación
    db: Session = Depends(get_db)
):
    """Obtener un reporte específico del estudiante"""
    updated_report = update_report(report_id, report_update, student_id, db)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return updated_report

@report_router.patch('/{report_id}/toggle-status', response_model=ReportOutput)
async def toggle_report_status_route(
    report_id: int, 
    student_id: int,  # TODO: Obtener del token de autenticación
    db: Session = Depends(get_db)
):
    """Cambiar el estado activo/inactivo de un reporte"""
    updated_report = toggle_report_status(report_id, student_id, db)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return updated_report

@report_router.get('/internship/{internship_id}', response_model=List[ReportOutput])
async def get_reports_by_internship_route(
    internship_id: int, 
    student_id: int,  # TODO: Obtener del token de autenticación
    db: Session = Depends(get_db)
):
    """Obtener reportes de una pasantía específica del estudiante"""
    reports = get_report_by_internship(internship_id, student_id, db)
    if not reports:
        return []
    return reports

@report_router.get('/site/{site_id}', response_model=List[ReportOutput])
async def get_reports_by_site_route(
    site_id: int, 
    student_id: int,  # TODO: Obtener del token de autenticación
    db: Session = Depends(get_db)
):
    """Obtener reportes de un sitio específico del estudiante"""
    reports = get_report_by_site(site_id, student_id, db)
    if not reports:
        return []
    return reports

#---------------REPORTS (ADMINISTRADORES)-------------------

admin_report_router = APIRouter(prefix="/admin/reports", tags=["Reportes - Administración"])

@admin_report_router.get('/{report_id}', response_model=ReportOutput)
async def get_report_admin_route(report_id: int, db: Session = Depends(get_db)):
    """Obtener un reporte específico (solo para administradores)"""
    from controllers.report import get_report_admin
    report = get_report_admin(report_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

@admin_report_router.patch('/{report_id}', response_model=ReportOutput)
async def update_report_admin_route(report_id: int, data: dict, db: Session = Depends(get_db)):
    """Actualizar un reporte específico (solo para administradores)"""
    from controllers.report import update_report_admin
    updated_report = update_report_admin(report_id, data, db)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return updated_report

@admin_report_router.get('/', response_model=List[ReportOutput])
async def get_all_reports_admin_route(db: Session = Depends(get_db)):
    """Obtener todos los reportes del sistema (solo para administradores)"""
    from controllers.report import get_all_reports_admin
    reports = get_all_reports_admin(db)
    if not reports:
        return []
    return reports

@admin_report_router.get('/open', response_model=List[ReportOutput])
async def get_open_reports_admin_route(db: Session = Depends(get_db)):
    """Obtener reportes abiertos (solo para administradores)"""
    from controllers.report import get_open_reports_admin
    reports = get_open_reports_admin(db)
    if not reports:
        return []
    return reports

@admin_report_router.get('/closed', response_model=List[ReportOutput])
async def get_closed_reports_admin_route(db: Session = Depends(get_db)):
    """Obtener reportes cerrados (solo para administradores)"""
    from controllers.report import get_open_reports_admin
    reports = get_closed_reports_admin(db)
    if not reports:
        return []
    return reports

@admin_report_router.patch('/{report_id}/admin-comment', response_model=ReportOutput)
async def add_admin_comment_route(
    report_id: int, 
    data: dict,
    db: Session = Depends(get_db)
):
    """Agregar comentario del administrador (solo para administradores)"""
    from controllers.report import add_admin_comment
    admin_comment = data.get('admin_comment', '')
    close_report = data.get('close_report', False)
    updated_report = add_admin_comment(report_id, admin_comment, db, close_report)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return updated_report