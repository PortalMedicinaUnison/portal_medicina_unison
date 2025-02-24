from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas.medical_record import MedicalRecordSchema
from models.medical_record import MedicalRecord
from core.dependencies import get_db
from controllers.medical_records import (
    create_medical_record, update_medical_record, read_medical_record
)


router = APIRouter(prefix="/medical_records", tags=["Medical Records"])


@router.post('/', response_model=MedicalRecordSchema)
async def create_medical_record_route(medical_record: MedicalRecordSchema, db: Session = Depends(get_db)):
    return create_medical_record(medical_record, db)


@router.put('/', response_model=MedicalRecordSchema)
async def update_medical_record_route(medical_record_form: MedicalRecordSchema, db: Session = Depends(get_db)):
    return update_medical_record(medical_record_form, db)


@router.get('/', response_model=MedicalRecordSchema)
async def read_medical_record_route(db: Session = Depends(get_db), skip: int = 0, limit: int = 10):
    return read_medical_record(db, skip, limit)
