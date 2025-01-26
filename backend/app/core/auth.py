from fastapi import HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer
frp, sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from passlib.context import CryptContext
import jwt

from core.settings import settings
from core.dependencies import get_db
from repos.user import get_user


oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "get_token")
pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM
TIME_TO_EXPIRE = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes = TIME_TO_EXPIRE)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt

def get_access_token(request: Request):
    access_token = request.cookies.get("access_token")
    if access_token is None:
        raise HTTPException(
            status_code = 404,
            detail = "Access token not found"
        )
    return access_token

def get_current_user(
        db: Session = Depends(get_db),
        token: str = Depends(oauth2_scheme)):

    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers = {"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None:
            raise credentials_exception
    except jwt.exceptions.InvalidTokenError:
        raise credentials_exception
    
    user = get_user(db, username, role)
    if user is None:
        raise credentials_exception
    return user