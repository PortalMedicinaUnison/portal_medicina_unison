from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.communication import AnnouncementInput, SurveyInput, ReportInput
from core.dependencies import get_db
from controllers.communication import (
    create_announcement, update_announcement, read_all_announcements, read_single_announcement, delete_announcement,
    create_survey, update_survey, read_all_surveys, read_single_survey, delete_survey,
    create_report, update_report, read_all_reports, read_single_report, delete_report
)


# ---------------  Announcement  ----------------------

announcement_router = APIRouter(prefix="/announcements", tags=["Avisos"])

@announcement_router.post('/', response_model=AnnouncementInput)
async def create_announcement_route(announcement: AnnouncementInput, db: Session = Depends(get_db)):
    return create_announcement(announcement, db)

@announcement_router.get('/', response_model=List[AnnouncementInput])
async def read_announcements_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_all_announcements(skip, limit, db)

@announcement_router.get('/', response_model=AnnouncementInput)
async def read_announcement_route(announcement_id: int, db: Session = Depends(get_db)):
    return read_single_announcement(announcement_id, db)

@announcement_router.patch('/', response_model=AnnouncementInput)
async def update_announcement_route(announcement_id: int, announcement: AnnouncementInput, db: Session = Depends(get_db)):
    return update_announcement(announcement_id, announcement, db)

@announcement_router.delete('/', response_model=AnnouncementInput)
async def delete_announcement_route(announcement_id: int, db: Session = Depends(get_db)):
    return delete_announcement(announcement_id, db)


# ---------------  Survey  ----------------------

survey_router = APIRouter(prefix="/surveys", tags=["Encuestas"])

@survey_router.post('/', response_model=SurveyInput)
async def create_survey_route(survey: SurveyInput, db: Session = Depends(get_db)):
    return create_survey(survey, db)

@survey_router.get('/', response_model=List[SurveyInput])
async def read_surveys_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_all_surveys(skip, limit, db)

@survey_router.get('/', response_model=SurveyInput)
async def read_survey_route(survey_id: int, db: Session = Depends(get_db)):
    return read_single_survey(survey_id, db)

@survey_router.patch('/', response_model=SurveyInput)
async def update_survey_route(survey_id: int, survey: SurveyInput, db: Session = Depends(get_db)):
    return update_survey(survey_id, survey, db)

@survey_router.delete('/', response_model=SurveyInput)
async def delete_survey_route(survey_id: int, db: Session = Depends(get_db)):
    return delete_survey(survey_id, db)


# ---------------  Report  ----------------------

report_router = APIRouter(prefix="/reports", tags=["Reportes"])

@report_router.post('/', response_model=ReportInput)
async def create_report_route(report: ReportInput, db: Session = Depends(get_db)):
    return create_report(report, db)

@report_router.get('/', response_model=List[ReportInput])
async def read_reports_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_all_reports(skip, limit, db)

@report_router.get('/', response_model=ReportInput)
async def read_report_route(report_id: int, db: Session = Depends(get_db)):
    return read_single_report(report_id, db)

@report_router.patch('/', response_model=ReportInput)
async def update_report_route(report_id: int, report: ReportInput, db: Session = Depends(get_db)):
    return update_report(report_id, report, db)

@report_router.delete('/', response_model=ReportInput)
async def delete_report_route(report_id: int, db: Session = Depends(get_db)):
    return delete_report(report_id, db)