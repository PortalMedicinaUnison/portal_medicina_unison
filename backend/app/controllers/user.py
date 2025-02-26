from fastapi import HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from core.dependencies import get_db
from repos.user import UserRepo, PreRegisteredUserRepo
from models.user import User, PreRegisteredUser
from schemas.user import UserInput, PreRegisteredUserInput


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

# *********************************************************************************************************************

def create_user(user_input: UserInput, db: Session) -> dict:
    """
    Transforma el objeto Pydantic validado en un modelo ORM, llama al Repository para crear
    el usuario y luego transforma el objeto ORM resultante en un diccionario para la respuesta.
    """
    # Pydantic --> ORM
    academic_id_int = int(user_input.academic_id)
    
    new_user = User(
        academic_id=academic_id_int,
        name=user_input.name,
        paternal_last_name=user_input.paternal_last_name,
        maternal_last_name=user_input.maternal_last_name,
        email=user_input.email,
        password=user_input.password,
        profile_photo=user_input.profile_photo,
        is_admin=user_input.is_admin,
        is_super_admin=user_input.is_super_admin,
    )
    
    user_repo = UserRepo(db)
    new_user = user_repo.create(new_user)
    
    # ORM --> Dict
    return {
        "user_id": new_user.user_id,
        "academic_id": new_user.academic_id,
        "name": new_user.name,
        "paternal_last_name": new_user.paternal_last_name,
        "maternal_last_name": new_user.maternal_last_name,
        "email": new_user.email,
        "profile_photo": new_user.profile_photo,
        "is_admin": new_user.is_admin,
        "is_super_admin": new_user.is_super_admin,
    }

def get_user(user_id: int, db: Session) -> dict:
    user_repo = UserRepo(db)
    user = user_repo.get_by_user_id(user_id)
    if not user:
        return None
    return {
        "user_id": user.user_id,
        "academic_id": user.academic_id,
        "name": user.name,
        "paternal_last_name": user.paternal_last_name,
        "maternal_last_name": user.maternal_last_name,
        "email": user.email,
        "profile_photo": user.profile_photo,
        "is_admin": user.is_admin,
        "is_super_admin": user.is_super_admin,
    }

def update_user(user_id: int, user_input: UserInput, db: Session) -> dict:
    update_data = user_input.dict(exclude_unset=True)
    user_repo = UserRepo(db)
    updated_user = user_repo.update(user_id, update_data)
    if not updated_user:
        return None
    return {
        "user_id": updated_user.user_id,
        "academic_id": updated_user.academic_id,
        "name": updated_user.name,
        "paternal_last_name": updated_user.paternal_last_name,
        "maternal_last_name": updated_user.maternal_last_name,
        "email": updated_user.email,
        "profile_photo": updated_user.profile_photo,
        "is_admin": updated_user.is_admin,
        "is_super_admin": updated_user.is_super_admin,
    }

def delete_user(user_id: int, db: Session) -> bool:
    user_repo = UserRepo(db)
    return user_repo.delete(user_id)
