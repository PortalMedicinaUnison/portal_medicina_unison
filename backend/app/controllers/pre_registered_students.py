from sqlalchemy.orm import Session
from backend.app.models.user import PreRegisteredStudent
from backend.app.schemas.medical_record import PreRegisteredStudentBase

def create_pre_registered_student(student_data: PreRegisteredStudentBase, db: Session):
    student = PreRegisteredStudent(**student_data.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def get_pre_registered_students(skip: int, limit: int, db: Session):
    return db.query(PreRegisteredStudent).offset(skip).limit(limit).all()