from contextlib import contextmanager
from sqlalchemy.orm import Session
from .session import SessionLocal
from fastapi import Depends
from typing_extensions import Annotated
from .oauth2 import oauth2_scheme

token_dependency = Annotated[str, Depends(oauth2_scheme)]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()