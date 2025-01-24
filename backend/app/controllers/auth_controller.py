from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from core.auth import authenticate_user, create_access_token, get_current_user
from schemas.auth_schemas import UserForm, TokenRequest


def authenticate_user(form_data: UserForm, db: Session):
    user = authenticate_user(db, form_data.username, form_data.password, form_data.role)
    if not user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Incorrect username or password",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": form_data.role})

    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(request: TokenRequest, db: Session):
    user = get_current_user(db, request.token)
    return {"status": "valid", "user_info": user}