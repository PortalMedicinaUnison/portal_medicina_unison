from fastapi import Request, Depends, HTTPException
from datetime import timedelta, datetime, timezone
import jwt
from core.settings import settings


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM
TIME_TO_EXPIRE = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

    if expires_delta:
        expiration = datetime.now(timezone.utc) + expires_delta
    else:
        expiration = datetime.now(timezone.utc) + timedelta(minutes = TIME_TO_EXPIRE)
    
    to_encode.update({"exp": expiration})
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.exceptions.InvalidTokenError:
        raise HTTPException(
            status_code = 401,
            detail = "Invalid token"
        )

def get_access_token(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(
            status_code = 404,
            detail = "Access token not found"
        )
    return access_token