from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.communication import AnnouncementInput, SurveyInput, ReportInput, AnnouncementTypeEnum
from core.dependencies import get_db
from controllers.communication import (
    create_announcement, update_announcement, read_announcements_by_type, read_single_announcement, delete_announcement,
    create_survey, update_survey, read_surveys_by_mandatory, read_single_survey, delete_survey,
    create_report, update_report, read_reports_by_mandatory, read_single_report, delete_report
)


# ---------------  Announcement  ----------------------

announcement_router = APIRouter(prefix="/announcements", tags=["Avisos"])

@announcement_router.post('/', response_model=AnnouncementInput)
async def create_announcement_route(announcement: AnnouncementInput, db: Session = Depends(get_db)):
    announcement = create_announcement(announcement, db)
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar el aviso")
    return announcement

@announcement_router.get('/', response_model=List[AnnouncementInput])
async def read_announcements_route(announcement_type: AnnouncementTypeEnum, db: Session = Depends(get_db)):
    announcements = read_announcements_by_type(announcement_type, db)
    if not announcements:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return announcements

@announcement_router.get('/{announcement_id}', response_model=AnnouncementInput)
async def read_announcement_route(announcement_id: int, db: Session = Depends(get_db)):
    announcement = read_single_announcement(announcement_id, db)
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return announcement

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


# ---------------  Survey  ----------------------

survey_router = APIRouter(prefix="/surveys", tags=["Encuestas"])

@survey_router.post('/', response_model=SurveyInput)
async def create_survey_route(survey: SurveyInput, db: Session = Depends(get_db)):
    survey = create_survey(survey, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar la encuesta")
    return survey

@survey_router.get('/', response_model=List[SurveyInput])
async def read_surveys_route(mandatory: bool, db: Session = Depends(get_db)):
    surveys = read_surveys_by_mandatory(mandatory, db)
    if not surveys:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return surveys

@survey_router.get('/{survey_id}', response_model=SurveyInput)
async def read_survey_route(survey_id: int, db: Session = Depends(get_db)):
    survey = read_single_survey(survey_id, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return survey

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


# ---------------  Report  ----------------------

report_router = APIRouter(prefix="/reports", tags=["Reportes"])

@report_router.post('/', response_model=ReportInput)
async def create_report_route(report: ReportInput, db: Session = Depends(get_db)):
    report = create_report(report, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar el reporte")
    return report

@report_router.get('/', response_model=List[ReportInput])
async def read_reports_route(mandatory: bool, db: Session = Depends(get_db)):
    reports = read_reports_by_mandatory(mandatory, db)
    if not reports:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return reports

@report_router.get('/{report_id}', response_model=ReportInput)
async def read_report_route(report_id: int, db: Session = Depends(get_db)):
    report = read_single_report(report_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

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