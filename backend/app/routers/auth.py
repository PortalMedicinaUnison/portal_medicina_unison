from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from schemas.user import UserForm, TokenRequest
from controllers.auth import authenticate_user, get_current_user
from core.dependencies import get_db

# router = APIRouter(prefix="/auth", tags=["Auth"])
router = APIRouter()

@router.post("/token/")
async def login_for_access_token_route(form_data: UserForm, db: Session = Depends(get_db)):
    return authenticate_user(form_data, db)

@router.post("/check_auth")
async def check_auth(request: TokenRequest, db: Session = Depends(get_db)):
    return get_current_user(request, db)
