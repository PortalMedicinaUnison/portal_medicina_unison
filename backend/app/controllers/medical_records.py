from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.medical_record import MedicalRecord
from schemas.medical_record import MedicalRecordSchema
from typing import List

def create_medical_record(medical_record_data: MedicalRecordSchema, db: Session) -> MedicalRecord:
    medical_record = MedicalRecord(**medical_record_data.dict())

    db.add(medical_record)
    db.commit()
    db.refresh(medical_record)

    return medical_record

def update_medical_record(medical_record_data: MedicalRecordSchema, db: Session) -> MedicalRecord:
    medical_record = db.query(MedicalRecord).filter(MedicalRecord.id == medical_record_data.id).first()

    if not medical_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medical record not found in database."
        )

    for attr, value in medical_record_data.dict().items():
        if value is not None:
            setattr(medical_record, attr, value)

    db.commit()
    db.refresh(medical_record)

    return medical_record

def read_medical_record(db: Session, skip: int = 0, limit: int = 10) -> List[MedicalRecord]:
    return db.query(MedicalRecord).offset(skip).limit(limit).all()
