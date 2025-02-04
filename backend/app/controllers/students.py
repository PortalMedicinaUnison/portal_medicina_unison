from fastapi import UploadFile
from sqlalchemy.orm import Session
from models.user import Student
from schemas.student import StudentBase, StudentSchema, StudentRequest
from schemas.admin import AdminBase
from utils.authentication import hash_password
from repos.pre_registered_students import is_pre_registered_student
import os

def create_student(student: StudentBase, db: Session):
    # REVISAR
    # if not is_pre_registered_student(db, student.file_number):
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Student not found in database"
    #     )
        
    student.password = hash_password(student.password)
    student = Student(**student.model_dump())
    student.profile_image_path = os.path.join("default_picture.jpg")
    db.add(student)
    db.commit()
    db.refresh(student)
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

def read_students(db: Session, skip: int, limit: int):
    return db.query(Student).offset(skip).limit(limit).all()

def read_student(request: StudentRequest, db: Session):
    return db.query(Student).filter(Student.id == request.student_id).first()

def upload_profile_picture(student_id: int, image: UploadFile, db: Session):
    file_location = os.path.join("profile_images", f"{student_id}.jpg")

    with open(file_location, "wb") as buffer:
        buffer.write(image.file.read())

    student = db.query(Student).filter(Student.id == student_id).first()
    if student:
        student.profile_image_path = file_location
        db.commit()
        db.refresh(student)
    
    return student