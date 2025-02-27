from sqlalchemy.orm import Session
from models.student import PreRegisteredStudent
from schemas.student import PreRegisteredStudentBase, PreRegisteredStudentSchema
from fastapi import HTTPException, status

def create_pre_registered_student(student: PreRegisteredStudentBase, db: Session):
    student = PreRegisteredStudent(**student.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def read_pre_registered_students(skip: int, limit: int, db: Session):
    students = db.query(PreRegisteredStudent).offset(skip).limit(limit).all()
    return students

def delete_pre_registered_student(student_id: int, db: Session):
    student = db.query(PreRegisteredStudent).filter(PreRegisteredStudent.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    db.delete(student)
    db.commit()
    return student