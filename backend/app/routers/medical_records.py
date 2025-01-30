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

db_dependency = Depends(get_db)

@router.post('/medical_record/')#, response_model=StudentSchema)
async def create_medical_record(medical_record: MedicalRecordSchema, db: db_dependency):
    return create_medical_record(medical_record, db)


@router.put('/medical_record/', response_model=MedicalRecordSchema)
async def update_medical_record(medical_record_form: MedicalRecordSchema, db: db_dependency):
    return update_medical_record(medical_record_form, db)


@router.get('/medical_record/', response_model=MedicalRecordSchema)
async def read_medical_record(db: db_dependency, skip: int = 0, limit: int = 10):
    return read_medical_record(db, skip, limit)
