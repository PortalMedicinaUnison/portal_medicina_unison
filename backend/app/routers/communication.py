from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.dependencies import get_db
from typing import List
from schemas.communication import (
    AnnouncementInput, AnnouncementInputUpdate, AnnouncementOutput,
    SurveyInput, SurveyInputUpdate, SurveyOutput
)
from controllers.communication import (
    create_announcement,
    get_all_announcements,
    get_announcement,
    update_announcement,
    delete_announcement,
    
    create_survey,
    get_all_surveys,
    get_survey,
    update_survey,
    delete_survey,
)

# ----------------------  ANNOUNCEMENT  ----------------------

announcement_router = APIRouter(prefix="/announcements", tags=["Avisos"])

@announcement_router.post('/', response_model=AnnouncementOutput)
async def create_announcement_route(announcement: AnnouncementInput, db: Session = Depends(get_db)):
    created_announcement = create_announcement(announcement, db)
    if not created_announcement:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar el aviso")
    return created_announcement

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

@announcement_router.patch('/{announcement_id}', response_model=AnnouncementOutput)
async def update_announcement_route(announcement_id: int, announcement: AnnouncementInputUpdate, db: Session = Depends(get_db)):
    updated_announcement = update_announcement(announcement_id, announcement, db)
    if not updated_announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return updated_announcement

@announcement_router.delete('/{announcement_id}')
async def delete_announcement_route(announcement_id: int, db: Session = Depends(get_db)):
    deleted = delete_announcement(announcement_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aviso no encontrado")
    return deleted

# ----------------------  SURVEY  ----------------------

survey_router = APIRouter(prefix="/surveys", tags=["Encuestas"])

@survey_router.post('/', response_model=SurveyInput)
async def create_survey_route(survey: SurveyInput, db: Session = Depends(get_db)):
    created_survey = create_survey(survey, db)
    if not created_survey:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo encontrar la encuesta")
    return created_survey

@survey_router.get('/', response_model=List[SurveyOutput])
async def get_surveys_route(db: Session = Depends(get_db)):
    surveys = get_all_surveys(db)
    return surveys

@survey_router.get('/{survey_id}', response_model=SurveyOutput)
async def get_survey_route(survey_id: int, db: Session = Depends(get_db)):
    survey = get_survey(survey_id, db)
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return survey

@survey_router.patch('/{survey_id}', response_model=SurveyOutput)
async def update_survey_route(survey_id: int, survey: SurveyInputUpdate, db: Session = Depends(get_db)):
    updated_survey = update_survey(survey_id, survey, db)
    if not updated_survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return updated_survey

@survey_router.delete('/{survey_id}')
async def delete_survey_route(survey_id: int, db: Session = Depends(get_db)):
    deleted = delete_survey(survey_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada")
    return deleted