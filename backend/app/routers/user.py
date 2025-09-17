from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from core.dependencies import get_db
from typing import List
from schemas.user import (
    UserInput, UserEnrollmentInput, UserEnrollmentOutput,
    UserInputUpdate, UserEnrollmentInputUpdate, UserOutput
)
from controllers.user import (
    create_user,
    get_user,
    get_all_users,
    get_user_by_academic_id,
    update_user,
    delete_user,

    create_user_enrollment,
    get_all_user_enrollments,
    get_user_enrollment,
    update_user_enrollment,
    delete_user_enrollment,
)

# ----------------------  USER  ----------------------

user_router = APIRouter(prefix="/users", tags=["Usuarios"])

@user_router.post("/", status_code=status.HTTP_201_CREATED)
def create_user_router(user_input: UserInput, db: Session = Depends(get_db)):
    user = create_user(user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el usuario")
    return user

@user_router.get('/', response_model=List[UserOutput])
async def get_users_route(db: Session = Depends(get_db)):
    users = get_all_users(db)
    return users

@user_router.get("/{user_id}", response_model=UserOutput)
def get_user_router(user_id: int, db: Session = Depends(get_db)):
    user = get_user(user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado")
    return user

@user_router.get("?academicId={academic_id}", response_model=UserOutput)
def get_user_router(academic_id: str, db: Session = Depends(get_db)):
    print("Antes de llamar a get_user:")
    user = get_user_by_academic_id(academic_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado")
    return user

@user_router.put("/{user_id}", response_model=UserOutput)
def update_user_router(user_id: int, user_input: UserInputUpdate, db: Session = Depends(get_db)):
    user = update_user(user_id, user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado")
    return user

@user_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_router(user_id: int, db: Session = Depends(get_db)):
    deleted = delete_user(user_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado")
    return deleted

@user_router.post("/{user_id}/profile-picture")
def upload_profile_picture_router(user_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    pass

# ----------------------  USER ENROLLMENT  ----------------------

user_enrollment_router = APIRouter(prefix="/enrollments", tags=["User Enrollments"])

@user_enrollment_router.post("/", status_code=status.HTTP_201_CREATED)
def create_user_enrollment_router(user_input: UserEnrollmentInput, db: Session = Depends(get_db)):
    user = create_user_enrollment(user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear el user enrollment")
    return user

@user_enrollment_router.get('/', response_model=List[UserEnrollmentOutput])
async def get_user_enrollments_route(db: Session = Depends(get_db)):
    user_enrollments = get_all_user_enrollments(db)
    return user_enrollments

@user_enrollment_router.get("/{enrollment_id}", response_model=UserEnrollmentOutput)
def get_user_enrollment_router(enrollment_id: int, db: Session = Depends(get_db)):
    user = get_user_enrollment(enrollment_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User enrollment no encontrado")
    return user

@user_enrollment_router.put("/{enrollment_id}", response_model=UserEnrollmentOutput)
def update_user_enrollment_router(enrollment_id: int, user_input: UserEnrollmentInputUpdate, db: Session = Depends(get_db)):
    user = update_user_enrollment(enrollment_id, user_input, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User enrollment no encontrado")
    return user

@user_enrollment_router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_enrollment_router(enrollment_id: int, db: Session = Depends(get_db)):
    deleted = delete_user_enrollment(enrollment_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User enrollment no encontrado")
    return deleted