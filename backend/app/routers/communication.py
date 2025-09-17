from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.communication import AnnouncementInput, AnnouncementOutput, SurveyInput, SurveyOutput, AnnouncementTypeEnum
from core.dependencies import get_db
from controllers.communication import (
    create_announcement,
    get_announcement,
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

@announcement_router.get('/', response_model=List[AnnouncementOutput])
async def get_announcements_route(db: Session = Depends(get_db)):
    announcements =  get_all_announcements(db)
    return announcements

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

@survey_router.get('/', response_model=List[SurveyOutput])
async def get_surveys_route(db: Session = Depends(get_db)):
    surveys =  get_all_surveys(db)
    return surveys

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