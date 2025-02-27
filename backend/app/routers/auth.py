from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from core.dependencies import get_db
from schemas.auth import LoginForm, TokenRequest, TokenResponse, CheckAuthResponse, UserInfo
from controllers.auth import authenticate_user, get_current_user


auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/login/", response_model=TokenResponse)
async def login_router(form_data: LoginForm, db: Session = Depends(get_db)):
    """
    Endpoint para iniciar sesión y obtener el token JWT.
    """
    return authenticate_user(form_data, db)

@auth_router.post("/verify", response_model=CheckAuthResponse)
async def verify_router(token_request: TokenRequest, db: Session = Depends(get_db)):
    """
    Endpoint para verificar la autenticación del usuario utilizando el token proporcionado.
    Retorna información básica del usuario autenticado.
    """
    user = get_current_user(token_request.token, db)
    user_info = {
        "email": user.email,
        "role": user.is_super_admin and "super_admin" or (user.is_admin and "admin" or "student")
    }
    return {"status": "valid", "user_info": user_info}
