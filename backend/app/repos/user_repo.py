from sqlalchemy.orm import Session
from models import user_models

def get_user(db: Session, username: str, role: str):
    if role == "student":
        user = db.query(user_models.Student).filter(user_models.Student.email == username).first()
    if role == "admin":
        user = db.query(user_models.Admin).filter(user_models.Admin.email == username).first()
    return user