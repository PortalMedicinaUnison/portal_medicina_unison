from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from schemas.user import UserForm, TokenRequest
from controllers.auth import authenticate_user, get_current_user
from core.dependencies import get_db


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/token/")
async def login(form_data: UserForm, db: Session):
    return authenticate_user(form_data, db)

@router.post("/check_auth")
async def check_auth(request: TokenRequest, db: Session):
    user = get_current_user(request, db)
    return {"status": "valid", "user_info": user}
