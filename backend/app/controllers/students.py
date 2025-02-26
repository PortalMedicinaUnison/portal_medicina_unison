from sqlalchemy.orm import Session
from models.student import Student
from schemas.student import StudentBase, StudentSchema, StudentRequest
from fastapi import HTTPException, status
from utils.authentication import hash_password
import os

def create_student(student: StudentBase, db: Session):
    # if not auth.is_student_accepted(db, student.file_number):
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Student not found in database"
    #     )

    student.password = hash_password(student.password)
    student = Student(**student.model_dump())

    if not student.profile_image_path:
        student.profile_image_path = os.path.join("default_picture.jpg")

    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def read_all_students(db: Session, skip: int, limit: int):
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

def read_single_student(student_id: int, db: Session):
    student = db.query(Student).filter(Student.id == student_id).first()

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found in database"
        )
    
    return student

def update_student(student_form: StudentSchema, db: Session):
    student = db.query(Student).filter(Student.id == student_form.id).first()

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found in database"
        )

    for attr in vars(student_form):
        value = getattr(student_form, attr)
        if value:
            setattr(student, attr, value)

    db.commit()
    db.refresh(student)
    return student

def delete_student(student_id: int, db: Session):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    db.delete(student)
    db.commit()
    return student

def upload_profile_picture():
    pass