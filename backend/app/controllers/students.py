from sqlalchemy.orm import Session
from models.student import Student

def create_student():
    pass

def update_student():
    pass

def read_students(db: Session, skip: int, limit: int):
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

def read_student():
    pass

def upload_profile_picture():
    pass