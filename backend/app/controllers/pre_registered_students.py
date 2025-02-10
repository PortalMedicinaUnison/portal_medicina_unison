from sqlalchemy.orm import Session
from models.user import PreRegisteredUser
from schemas.student import PreRegisteredStudentBase

def create_pre_registered_student(student_data: PreRegisteredStudentBase, db: Session):
    student = PreRegisteredUser(**student_data.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def get_pre_registered_students(skip: int, limit: int, db: Session):
    return db.query(PreRegisteredUser).offset(skip).limit(limit).all()