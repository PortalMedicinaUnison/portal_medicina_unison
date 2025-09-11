from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.communication import AnnouncementInput, AnnouncementOutput, SurveyInput, SurveyOutput, ReportInput, AnnouncementTypeEnum
from core.dependencies import get_db
from controllers.communication import (
    create_announcement,
    get_announcement,
    get_announcements_by_type,
    get_all_announcements,
    update_announcement,
    delete_announcement,
    create_survey,
    update_survey,
    get_survey,
    get_all_surveys,
    get_surveys_by_mandatory,
    update_survey,
    delete_survey,
    create_report,
    get_report,
    get_reports_by_mandatory,
    update_report,
    delete_report
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

@announcement_router.get('/{announcement_id}', response_model=AnnouncementOutput)
async def get_announcement_route(announcement_id: int, db: Session = Depends(get_db)):
    announcement = get_announcement(announcement_id, db)
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return announcement

@announcement_router.get('/{announcement_type}', response_model=List[AnnouncementOutput])
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

@announcement_router.get('/', response_model=List[AnnouncementOutput])
async def get_announcements_route(db: Session = Depends(get_db)):
    announcements =  get_all_announcements(db)
    if not announcements:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
        detail="Avisos no encontrados")
    return announcements

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

@survey_router.get('/{survey_id}', response_model=SurveyOutput)
async def get_survey_route(survey_id: int, db: Session = Depends(get_db)):
    survey = get_survey(survey_id, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return survey

@survey_router.get('/{mandatory}', response_model=List[SurveyOutput])
async def get_surveys_by_mandatory_route(mandatory: bool, db: Session = Depends(get_db)):
    surveys = get_surveys_by_mandatory(mandatory, db)
    if not surveys:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return surveys

@survey_router.get('/', response_model=List[SurveyOutput])
async def get_surveys_route(db: Session = Depends(get_db)):
    surveys =  get_all_surveys(db)
    if not surveys:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuestas no encontradas")
    return surveys

@survey_router.patch('/{survey_id}', response_model=SurveyOutput)
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

@report_router.post('/', response_model=ReportInput)
async def create_report_route(report: ReportInput, db: Session = Depends(get_db)):
    report = create_report(report, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar el reporte")
    return report

@report_router.get('/{report_id}', response_model=ReportInput)
async def get_report_route(report_id: int, db: Session = Depends(get_db)):
    report = get_report(report_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

@report_router.get('/', response_model=List[ReportInput])
async def get_reports_by_mandatory_route(mandatory: bool, db: Session = Depends(get_db)):
    reports = get_reports_by_mandatory(mandatory, db)
    if not reports:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return reports

@report_router.patch('/{report_id}', response_model=ReportInput)
async def update_report_route(report_id: int, report: ReportInput, db: Session = Depends(get_db)):
    report = update_report(report_id, report, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

@report_router.delete('/{report_id}')
async def delete_report_route(report_id: int, db: Session = Depends(get_db)):
    report = delete_report(report_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report
