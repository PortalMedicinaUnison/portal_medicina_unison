from sqlalchemy.orm import Session
from backend.app.models.user import Student
from backend.app.schemas.medical_record import StudentBase, StudentSchema, StudentRequest, AdminSchema
from core.auth import get_password_hash, is_student_accepted
import os

def create_student(student_data: StudentBase, db: Session):
    if not auth.is_student_accepted(db, student.file_number):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found in database"
            )
        
        student.password = auth.get_password_hash(student.password)
        student = Student(**student.model_dump())
        student.profile_image_path = os.path.join("default_picture.jpg")
        db.add(student)
        db.commit()
        db.refresh(student)
        return student

def update_student(student_form: StudentSchema, db: Session):
    student = db.query(models.Student).filter(models.Student.id == student_form.id).first()

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