from sqlalchemy.orm import Session
from models import user

def is_pre_registered_student(db: Session, file_number: int):
    student = db.query(user.AcceptedStudent).filter(user.AcceptedStudent.file_number == file_number).first()
    return student is not None