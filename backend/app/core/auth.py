from fastapi import HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer

from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from sqlalchemy.orm import Session
from repos.user_repo import get_user
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "get_token")

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

SECRET_KEY = "dd204e00a3783421a3622d011c7d883bccb911fdf30aae45f1241d05328e5c4b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
ACCESS_TOKEN_EXPIRE_SECONDS = 0

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(db: Session, username: str, password: str, role: str):
    user = get_user(db, username, role)
    if not user or not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

    # REMINDER
    if expires_delta:
        expire = datetime.now(timezone.utc)() + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES, seconds = ACCESS_TOKEN_EXPIRE_SECONDS)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)

def get_access_token(request: Request):
    access_token = request.cookies.get("access_token")
    if access_token is None:
        raise HTTPException(
            status_code = 404,
            detail = "Access token not found"
        )
    return access_token

def get_current_user(db: Session, token: str = None): #Annotated[str, Depends(oauth2_scheme)]
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