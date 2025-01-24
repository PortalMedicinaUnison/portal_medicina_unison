from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.schemas.medical_record_schemas import medical_record_schemas
from controllers.medical_record_controller import (
    create_medical_record, update_medical_record, read_medical_record
)
from db.database import get_db

router = APIRouter(prefix="/medical_records", tags=["medical_records"])

db_dependency = Depends(get_db)

@app.post('/medical_record/')#, response_model=schemas.StudentSchema)
async def create_medical_record(medical_record: schemas.MedicalRecordSchema, db: db_dependency):
    medical_record = models.MedicalRecord(**medical_record.model_dump())
    db.add(medical_record)
    db.commit()
    db.refresh(medical_record)
    return medical_record

@app.put('/medical_record/', response_model=schemas.MedicalRecordSchema)
async def update_medical_record(medical_record_form: schemas.MedicalRecordSchema, db: db_dependency):
    medical_record = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medical_record_form.id).first()

    if medical_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medical record not found in database."
        )

    for attr in vars(medical_record):
        value = getattr(medical_record, attr)
        if value:
            setattr(medical_record, attr, value)

    db.commit()
    db.refresh(medical_record)
    return medical_record

@app.get('/medical_record/', response_model=schemas.MedicalRecordSchema)
async def read_medical_record(db: db_dependency, skip: int = 0, limit: int = 10):
    medical_record = db.query(models.MedicalRecord).offset(skip).limit(limit).all()
    return medical_record