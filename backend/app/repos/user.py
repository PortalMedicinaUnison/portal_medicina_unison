from sqlalchemy.orm import Session
from models import user

def get_user(db: Session, username: str, role: str):
    if role == "student":
        user = db.query(user.Student).filter(user.Student.email == username).first()
    if role == "admin":
        user = db.query(user.Admin).filter(user.Admin.email == username).first()
    return user