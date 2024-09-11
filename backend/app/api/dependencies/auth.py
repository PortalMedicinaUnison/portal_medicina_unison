from fastapi import Depends, Response, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt

import bcrypt
from datetime import timedelta, datetime, timezone
from crud.crud import get_user
from db.database import get_db
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "dd204e00a3783421a3622d011c7d883bccb911fdf30aae45f1241d05328e5c4b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1
ACCESS_TOKEN_EXPIRE_SECONDS = 0

def hash_password(password: str):
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def verify_password(password: str, hashed_password: str):
    # Verify the provided password against the stored hash
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

# Helper function to authenticate user
def authenticate_user(email: str, password: str, db: Session = Depends(get_db)):
    user = get_user(db=db, email=email)
    if not user or not verify_password(password, user.password):
        return None

    return user

# Helper function to create JWT token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc)() + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES, seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    email: str = payload.get("sub")
    return email

def get_current_user(token: str):
    user = decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def get_access_token(request: Request):
    access_token = request.cookies.get("access_token")
    return access_token
  