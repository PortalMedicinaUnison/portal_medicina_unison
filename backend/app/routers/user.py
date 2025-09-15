from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List
from sqlalchemy.orm import Session
from schemas.user import UserInput, UserEnrollmentInput, UserInputUpdate, UserEnrollmentInputUpdate, UserOutput
from core.dependencies import get_db
from controllers.user import (
    create_user,
    get_user,
    get_all_users,
    update_user,
    delete_user,
    create_user_enrollment,
    get_user_enrollment,
    get_all_user_enrollments,
    update_user_enrollment,
    delete_user_enrollment,
)

# ----------------------  Users  ----------------------

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
def update_user_router(user_id: int, user_input: UserInputUpdate, db: Session = Depends(get_db)):
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

@user_router.get('/', response_model=List[UserOutput])
async def get_users_route(db: Session = Depends(get_db)):
    users =  get_all_users(db)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuarios no encontrados")
    return users

# ----------------------  Pre-Registered Users  ----------------------

user_enrollment_router = APIRouter(prefix="/user/enrollments", tags=["User Enrollments"])

@user_enrollment_router.post("/", status_code=status.HTTP_201_CREATED)
def create_user_enrollment_router(user_input: UserEnrollmentInput, db: Session = Depends(get_db)):
    user = create_user_enrollment(user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear el user enrollment")
    return user

@user_enrollment_router.get("/{academic_id}")
def get_user_enrollment_router(academic_id: int, db: Session = Depends(get_db)):
    user = get_user_enrollment(academic_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User enrollment no encontrado")
    return user

@user_enrollment_router.put("/{academic_id}")
def update_user_enrollment_router(academic_id: int, user_input: UserEnrollmentInputUpdate, db: Session = Depends(get_db)):
    user = update_user_enrollment(academic_id, user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User enrollment no encontrado")
    return user

@user_enrollment_router.delete("/{academic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_enrollment_router(academic_id: int, db: Session = Depends(get_db)):
    if not delete_user_enrollment(academic_id, db):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User enrollment no encontrado")
    return

@user_enrollment_router.get('/', response_model=List[UserEnrollmentInput])
async def get_user_enrollments_route(db: Session = Depends(get_db)):
    user_enrollments = get_all_user_enrollments(db)
    if not user_enrollments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Users enrollments no encontrado")
    return user_enrollments