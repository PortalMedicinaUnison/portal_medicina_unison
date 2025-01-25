from sqlalchemy.orm import Session
from backend.app.models.user import Admin
from backend.app.schemas.admin import AdminBase
from core.auth import get_password_hash


def create_admin(admin_data: AdminBase, db: Session):
    admin.password = get_password_hash(admin.password)
    admin = Admin(**admin.model_dump())
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

def read_admins(skip: int, limit: int, db: Session):
    students = db.query(Admin).offset(skip).limit(limit).all()
    return students