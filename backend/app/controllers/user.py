from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from repos.user import UserRepo, UserEnrollmentRepo
from models.user import User, UserEnrollment
from schemas.user import (
    UserEnrollmentInput, UserEnrollmentInputUpdate,
    UserInput, UserInputUpdate
)
from utils.security import hash_password
from utils.utils import orm_to_dict, map_to_model


# ---------------------- USER ENROLLMENT ----------------------

def create_user_enrollment(user_input: UserEnrollmentInput, db: Session) -> dict:
    new_user_enrollment = map_to_model(user_input, UserEnrollment)
    user_enrollment_repo = UserEnrollmentRepo(db)
    created_user_enrollment = user_enrollment_repo.create(new_user_enrollment)
    user_enrollment_response = orm_to_dict(created_user_enrollment)
    return user_enrollment_response

def get_all_user_enrollments(db: Session):
    user_enrollment_repo = UserEnrollmentRepo(db)
    user_enrollments = user_enrollment_repo.get_all()
    if not user_enrollments:
        return []
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
    update_data = user_input.dict(exclude_unset=True)
    user_enrollment_repo = UserEnrollmentRepo(db)
    updated_user = user_enrollment_repo.update(enrollment_id, update_data)
    if not updated_user:
        return None
    user_enrollment_response = orm_to_dict(updated_user)
    return user_enrollment_response

def delete_user_enrollment(enrollment_id: int, db: Session) -> bool:
    user_enrollment_repo = UserEnrollmentRepo(db)
    return user_enrollment_repo.delete(enrollment_id)

# ---------------------- USER ----------------------

def create_user(user_input: UserInput, db: Session) -> dict:
    user_input.password = hash_password(user_input.password)
    new_user = map_to_model(user_input, User)
    user_repo = UserRepo(db)
    created_user = user_repo.create(new_user)
    user_response = orm_to_dict(created_user, exclude=["password"])
    return user_response

def get_all_users(db: Session):
    user_repo = UserRepo(db)
    users = user_repo.get_all()
    if not users:
        return []
    user_reponse = [orm_to_dict(user) for user in users]
    return user_reponse

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

    
