from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List
from sqlalchemy.orm import Session
from schemas.user import UserInput, PreRegisteredUserInput
from core.dependencies import get_db
from controllers.user import (
    create_user,
    get_user,
    get_all_users,
    update_user,
    delete_user,
    create_pre_registered_user,
    get_pre_registered_user,
    update_pre_registered_user,
    delete_pre_registered_user,
)


user_router = APIRouter(prefix="/users", tags=["Usuarios"])

@user_router.post("/", status_code=status.HTTP_201_CREATED)
def create_user_router(user_input: UserInput, db: Session = Depends(get_db)):
    user = create_user(user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el usuario")
    return user

@user_router.get("/{user_id}")
def get_user_router(user_id: int, db: Session = Depends(get_db)):
    user = get_user(user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado")
    return user

@user_router.put("/{user_id}")
def update_user_router(user_id: int, user_input: UserInput, db: Session = Depends(get_db)):
    user = update_user(user_id, user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado")
    return user

@user_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_router(user_id: int, db: Session = Depends(get_db)):
    if not delete_user(user_id, db):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado")
    return

@user_router.post("/{user_id}/upload-profile-picture")
def upload_profile_picture_router(user_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    pass

@user_router.get('/')#, response_model=List[UserInput])
async def get_users_route(db: Session = Depends(get_db)):
    users =  get_all_users(db)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuarios no encontrados")
    return users
# ********************************************************************************************************************

pre_registered_router = APIRouter(prefix="/pre-registered", tags=["Pre-Registrados"])

@pre_registered_router.post("/", status_code=status.HTTP_201_CREATED)
def create_pre_registered_user_router(user_input: PreRegisteredUserInput, db: Session = Depends(get_db)):
    user = create_pre_registered_user(user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear el usuario pre-registrado")
    return user

@pre_registered_router.get("/{academic_id}")
def get_pre_registered_user_router(academic_id: int, db: Session = Depends(get_db)):
    user = get_pre_registered_user(academic_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario pre-registrado no encontrado")
    return user

@pre_registered_router.put("/{academic_id}")
def update_pre_registered_user_router(academic_id: int, user_input: PreRegisteredUserInput, db: Session = Depends(get_db)):
    user = update_pre_registered_user(academic_id, user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario pre-registrado no encontrado")
    return user

@pre_registered_router.delete("/{academic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pre_registered_user_router(academic_id: int, db: Session = Depends(get_db)):
    if not delete_pre_registered_user(academic_id, db):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario pre-registrado no encontrado")
    return

@pre_registered_router.get('/', response_model=List[PreRegisteredUserInput])
async def get_pre_registered_users_route(db: Session = Depends(get_db)):
    pre_registered_users =  get_all_pre_registered_users(db)
    if not pre_registered_users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuarios pre-registrados no encontrado")
    return pre_registered_users
