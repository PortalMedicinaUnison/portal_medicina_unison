from fastapi import HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer

from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi import Depends
from models import models
from sqlalchemy.orm import Session
import jwt
# import jwt
# from jwt.exceptions import InvalidTokenError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "dd204e00a3783421a3622d011c7d883bccb911fdf30aae45f1241d05328e5c4b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 2
ACCESS_TOKEN_EXPIRE_SECONDS = 0

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, username: str, role: str):
    if role == "student":
        user = db.query(models.Student).filter(models.Student.email == username).first()
    if role == "admin":
        user = db.query(models.Admin).filter(models.Admin.email == username).first()
    return user

def authenticate_user(db: Session, username: str, password: str, role: str):
    user = get_user(db, username, role)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def is_student_accepted(db: Session, file_number: int):
    student = db.query(models.AcceptedStudent).filter(models.AcceptedStudent.file_number == file_number).first()
    return student is not None

# Helper function to create JWT token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc)() + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES, seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_access_token(request: Request):
    access_token = request.cookies.get("access_token")
    if access_token is None:
        raise HTTPException(
            status_code=404,
            detail="Access token not found"
        )
    return access_token

def get_current_user(db: Session, token: str = None): #Annotated[str, Depends(oauth2_scheme)]
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
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

# def fake_decode_token(token):
#     # This doesn't provide any security at all
#     # Check the next version
#     user = get_user(fake_users_db, token)
#     return user

# def get_access_token(request: Request):
#     access_token = request.cookies.get("access_token")
#     return access_token
  