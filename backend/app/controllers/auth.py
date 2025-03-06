from fastapi import HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from core.dependencies import get_db
from core.auth import create_access_token, decode_access_token, get_access_token
from utils.security import verify_password, get_user_role
from repos.user import UserRepo 
from models.user import User
from schemas.auth import LoginForm, TokenResponse, TokenRequest


def authenticate_user(form_data: LoginForm, db: Session) -> TokenResponse:
    """
    Autentica al usuario y retorna un TokenResponse con el JWT.
    """
    user_repo = UserRepo(db)
    user = user_repo.get_by_email(form_data.email)
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Incorrect username or password",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(data={
        "sub": user.user_id,
    })
    return TokenResponse(access_token=token, token_type="bearer")


def get_current_user(token: str, db: Session) -> User:
    """
    Valida el token y retorna el usuario autenticado.
    """
    payload = decode_access_token(token)

    if not payload or payload.get("sub") is None:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Could not validate credentials",
            headers = {"WWW-Authenticate": "Bearer"},
        )

    user_id = int(payload["sub"])
    
    user_repo = UserRepo(db)
    user = user_repo.get_by_id(user_id)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def autorize_user(user: User, role: str):
    """
    Verifica si el usuario tiene el rol necesario para acceder a un recurso.
    """
    user_role = get_user_role(user)
    if user_role != role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have enough privileges",
            headers={"WWW-Authenticate": "Bearer"},
        )

def refresh_token(token_request: TokenRequest, db: Session = Depends(get_db)):
    """
    Renueva el token JWT basado en el token actual.
    """
    payload = decode_access_token(token_request.token)

    if not payload or payload.get("sub") is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token")
    
    user_id: str = payload.get("sub")
    user_repo = UserRepo(db)
    user = user_repo.get_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=401, 
            detail="User not found")
    
    new_token = create_access_token(data={
        "sub": user.user_id,
    })
    return TokenResponse(access_token=new_token, token_type="bearer")

def get_current_user_from_cookie(request: Request, db: Session):
    """
    Extrae el token desde la cookie, lo valida y retorna el usuario.
    """
    token = get_access_token(request)
    return get_current_user(token, db)
