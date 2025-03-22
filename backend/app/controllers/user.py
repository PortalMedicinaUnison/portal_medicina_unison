from fastapi import HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from core.dependencies import get_db
from repos.user import UserRepo, PreRegisteredUserRepo
from models.user import User, PreRegisteredUser
from schemas.user import UserInput, PreRegisteredUserInput
from utils.security import hash_password
from utils.utils import orm_to_dict


def create_pre_registered_user(user_input: PreRegisteredUserInput, db: Session) -> dict:
    academic_id_int = int(user_input.academic_id)
    new_pre_user = PreRegisteredUser(
        academic_id=academic_id_int,
        assigned_year=user_input.assigned_year,
        assigned_period=user_input.assigned_period,
    )
    pre_registered_repo = PreRegisteredUserRepo(db)
    created_pre_user = pre_registered_repo.create(new_pre_user)
    pre_user_response = orm_to_dict(created_pre_user)
    return pre_user_response

def get_pre_registered_user(academic_id: int, db: Session) -> dict:
    pre_registered_repo = PreRegisteredUserRepo(db)
    pre_user = pre_registered_repo.get_by_academic_id(academic_id)
    if not pre_user:
        return None
    pre_user_response = orm_to_dict(pre_user)
    return pre_user_response

def update_pre_registered_user(academic_id: int, user_input: PreRegisteredUserInput, db: Session) -> dict:
    pass

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
    hashed_password = hash_password(user_input.password)
    new_user = User(
        academic_id=academic_id_int,
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

def update_user(user_id: int, user_input: UserInput, db: Session) -> dict:
    pass

def delete_user(user_id: int, db: Session) -> bool:
    user_repo = UserRepo(db)
    return user_repo.delete(user_id)
