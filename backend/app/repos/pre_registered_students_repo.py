from sqlalchemy.orm import Session
from models import user_models

def is_pre_registered_student(db: Session, file_number: int):
    student = db.query(user_models.AcceptedStudent).filter(user_models.AcceptedStudent.file_number == file_number).first()
    return student is not None