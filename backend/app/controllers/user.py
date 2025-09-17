from fastapi import HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from repos.user import UserRepo, UserEnrollmentRepo
from models.user import User, UserEnrollment
from schemas.user import (
    UserEnrollmentInput, UserEnrollmentInputUpdate, UserEnrollmentOutput,
    UserInput, UserInputUpdate, UserInputUpdateByAdmin, UserPasswordUpdate, UserOutput
)
from utils.security import hash_password
from utils.utils import orm_to_dict


# ---------------------- USER ENROLLMENTS ----------------------

def create_user_enrollment(user_input: UserEnrollmentInput, db: Session) -> dict:
    new_user_enrollment = UserEnrollment(
        academic_id=user_input.academic_id,
        is_enrolled=user_input.is_enrolled,
    )
    user_enrollment_repo = UserEnrollmentRepo(db)
    created_user_enrollment = user_enrollment_repo.create(new_user_enrollment)
    user_enrollment_response = orm_to_dict(created_user_enrollment)
    return user_enrollment_response

def get_all_user_enrollments(db: Session):
    user_enrollment_repo = UserEnrollmentRepo(db)
    user_enrollments = user_enrollment_repo.get_all()
    if not user_enrollments:
        return None
    user_enrollments_response = [orm_to_dict(user) for user in user_enrollments]
    return user_enrollments_response

def get_user_enrollment(enrollment_id: int, db: Session) -> dict:
    user_enrollment_repo = UserEnrollmentRepo(db)
    user_enrollment = user_enrollment_repo.get_by_id(enrollment_id)
    if not user_enrollment:
        return None
    user_enrollment_response = orm_to_dict(user_enrollment)
    return user_enrollment_response

def update_user_enrollment(enrollment_id: int, user_input: UserEnrollmentInputUpdate, db: Session) -> dict:
    all_data = user_input.dict()
    update_data = {key: value for key, value in all_data.items() if value is not None}

    user_enrollment_repo = UserEnrollmentRepo(db)
    updated_user = user_enrollment_repo.update(enrollment_id, update_data)
    if not updated_user:
        return None
    user_enrollment_response = orm_to_dict(updated_user)
    return user_enrollment_response

def delete_user_enrollment(enrollment_id: int, db: Session) -> bool:
    user_enrollment_repo = UserEnrollmentRepo(db)
    return user_enrollment_repo.delete(enrollment_id)

# ---------------------- USERS ----------------------

def create_user(user_input: UserInput, db: Session) -> dict:
    hashed_password = hash_password(user_input.password)
    new_user = User(
        academic_id=user_input.academic_id,
        first_name=user_input.first_name,
        last_name=user_input.last_name,
        second_last_name=user_input.second_last_name,
        email=user_input.email,
        password=hashed_password,
        profile_photo=user_input.profile_photo,
        is_admin=user_input.is_admin,
        is_super_admin=user_input.is_super_admin,
    )
    user_repo = UserRepo(db)
    created_user = user_repo.create(new_user)
    user_response = orm_to_dict(created_user, exclude=["password"])
    return user_response

def get_user(user_id: int, db: Session) -> dict:
    user_repo = UserRepo(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        return None
    user_response = orm_to_dict(user)
    return user_response

def get_user_by_academic_id(academic_id: int, db: Session):
    user_repo = UserRepo(db)
    user = user_repo.get_by_academic_id(academic_id)
    if not user:
        return None
    user_response = orm_to_dict(user)
    return user_response

def update_user(user_id: int, user_input: UserInputUpdate, db: Session) -> dict:
    update_data = user_input.dict(exclude_unset=True)
    user_repo = UserRepo(db)
    updated_user = user_repo.update(user_id, update_data)
    if not updated_user:
        return None
    user_response = orm_to_dict(updated_user)
    return user_response

def delete_user(user_id: int, db: Session) -> bool:
    user_repo = UserRepo(db)
    return user_repo.delete(user_id)

def get_all_users(db: Session):
    user_repo = UserRepo(db)
    users = user_repo.get_all()
    if not users:
        return None
    user_reponse = [orm_to_dict(user) for user in users]
    return user_reponse
    
