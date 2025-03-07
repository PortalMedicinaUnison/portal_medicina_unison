from fastapi import HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from core.dependencies import get_db
from repos.user import UserRepo, PreRegisteredUserRepo
from models.user import User, PreRegisteredUser
from schemas.user import UserInput, PreRegisteredUserInput
from utils.security import hash_password


def create_pre_registered_user(user_input: PreRegisteredUserInput, db: Session) -> dict:
    academic_id_int = int(user_input.academic_id)
    new_pre_user = PreRegisteredUser(
        academic_id=academic_id_int,
        assigned_year=user_input.assigned_year,
        assigned_period=user_input.assigned_period,
    )
    pre_registered_repo = PreRegisteredUserRepo(db)
    created_pre_user = pre_registered_repo.create(new_pre_user)
    return {
        "pre_registered_id": created_pre_user.pre_registered_id,
        "academic_id": created_pre_user.academic_id,
        "assigned_year": created_pre_user.assigned_year,
        "assigned_period": created_pre_user.assigned_period,
    }

def get_pre_registered_user(academic_id: int, db: Session) -> dict:
    pre_registered_repo = PreRegisteredUserRepo(db)
    pre_user = pre_registered_repo.get_by_academic_id(academic_id)
    if not pre_user:
        return None
    return {
        "pre_registered_id": pre_user.pre_registered_id,
        "academic_id": pre_user.academic_id,
        "assigned_year": pre_user.assigned_year,
        "assigned_period": pre_user.assigned_period,
    }

def update_pre_registered_user(academic_id: int, user_input: PreRegisteredUserInput, db: Session) -> dict:
    update_data = user_input.dict(exclude_unset=True)
    pre_registered_repo = PreRegisteredUserRepo(db)
    updated_user = pre_registered_repo.update(academic_id, update_data)
    if not updated_user:
        return None
    return {
        "pre_registered_id": updated_user.pre_registered_id,
        "academic_id": updated_user.academic_id,
        "assigned_year": updated_user.assigned_year,
        "assigned_period": updated_user.assigned_period,
    }

def delete_pre_registered_user(academic_id: int, db: Session) -> bool:
    pre_registered_repo = PreRegisteredUserRepo(db)
    return pre_registered_repo.delete(academic_id)