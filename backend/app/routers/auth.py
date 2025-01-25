from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from schemas.auth_schemas import UserForm, TokenRequest
from backend.app.controllers.auth import authenticate_user, create_access_token, get_current_user
from core.dependencies import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

db_dependency = Depends(get_db)

@app.post("/token/")
async def login_for_access_token_route(form_data: UserForm, db: db_dependency):
    return authenticate_user(form_data, db)

@app.post("/check_auth")
async def check_auth(request: schemas.TokenRequest, db: db_dependency):
    return get_current_user(request, db)
