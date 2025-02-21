from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from core.auth import create_access_token, decode_access_token, get_access_token
from utils.security import verify_password, get_user_role
from repos.user import get_by_email 
from schemas.auth import LoginForm, TokenResponse, TokenRequest



def authenticate_user(form_data: LoginForm, db: Session):
    user = get_by_email(db, form_data.email)
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Incorrect username or password",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(data={
        "sub": user.email,
        "role": get_user_role(user)
    })

    return TokenResponse("access_token": token, "token_type": "bearer")


def get_current_user(db: Session, token: str):    
    payload = decode_access_token(token)

    if not payload or payload.get("sub") is None:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Could not validate credentials",
            headers = {"WWW-Authenticate": "Bearer"},
        )

    email: str = payload.get("sub")
    role: str = payload.get("role")
    user = get_by_email(db, email)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if role != get_user_role(user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User role mismatch",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def refresh_token(token_request: TokenRequest, db: Session = Depends(get_db)):
    payload = decode_access_token(token_request.token)
    if not payload or payload.get("sub") is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    email = payload.get("sub")
    user = get_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    new_token = create_access_token(data={
        "sub": user.email,
        "role": get_user_role(user)
    })
    return TokenResponse(access_token=new_token, token_type="bearer")

async def get_current_user_from_cookie(request: Request, db: Session = Depends(get_db)):
    token = get_access_token(request)
    payload = decode_access_token(token)
    if not payload or payload.get("sub") is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    email = payload.get("sub")
    user = get_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    if payload.get("role") != get_user_role(user):
        raise HTTPException(status_code=401, detail="User role mismatch")
    return user
