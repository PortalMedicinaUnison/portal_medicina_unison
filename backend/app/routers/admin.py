from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.schemas.admin import AdminSchema, AdminBase
from backend.app.controllers.admin import create_admin, read_admins
from core.dependencies import get_db

router = APIRouter(prefix="/admin", tags=["Admin"])

db_dependency = Depends(get_db)

@router.post('/', response_model = AdminSchema)
async def create_admin_route(admin: AdminBase, db: db_dependency):
    return create_admin(db, admin)

@router.get('/', response_model=List[AdminSchema])
async def read_admins_route(skip: int = 0, limit: int = 10, db: Session = db_dependency):
    return read_admins(db, skip, limit)
