from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.dependencies import get_db
from schemas.auth import LoginForm, TokenRequest, TokenResponse
from controllers.auth import authenticate_user, get_current_user


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/token/", response_model=TokenResponse)
async def login(form_data: LoginForm, db: Session = Depends(get_db)):
    return authenticate_user(form_data, db)

@router.post("/check_auth", response_model=TokenRequest)
async def check_auth(request: TokenRequest, db: Session):
    user = get_current_user(request, db)
    return {"status": "valid", "user_info": user}
