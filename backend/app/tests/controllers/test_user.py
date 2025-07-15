import pytest
from sqlalchemy.orm import Session
from models.user import User, PreRegisteredUser
from repos.user import UserRepo, PreRegisteredUserRepo
from schemas.user import UserInput, PreRegisteredUserInput, UserInputUpdate, PreRegisteredUserInputUpdate
from controllers.user import (
    create_user, get_user, update_user, delete_user,
    create_pre_registered_user, get_pre_registered_user, update_pre_registered_user, delete_pre_registered_user
)

def test_create_pre_registered_user(db_session: Session):
    user_input = PreRegisteredUserInput(
        academic_id="222203834",
        assigned_year=2025,
        assigned_period=2025
    )
    
    result = create_pre_registered_user(user_input, db_session)
    
    assert result["academic_id"] == "222203834"
    assert result["assigned_year"] == 2025
    assert result["assigned_period"] == 2025
    
    pre_user_repo = PreRegisteredUserRepo(db_session)
    db_user = pre_user_repo.get_by_id(result["pre_registered_id"])
    assert db_user is not None
    assert db_user.academic_id == "222203834"
    assert db_user.assigned_year == 2025
    assert db_user.assigned_period == 2025

    
def test_get_pre_registered_user(db_session: Session):
    pre_user_repo = PreRegisteredUserRepo(db_session)
    pre_user = pre_user_repo.create(PreRegisteredUser(
        academic_id="123123123",
        assigned_year=2024,
        assigned_period=1
    ))
    result = get_pre_registered_user(pre_user.academic_id, db_session)
    assert result is not None
    assert result["assigned_year"] == 2024

def test_update_pre_registered_user(db_session: Session):
    pre_user_repo = PreRegisteredUserRepo(db_session)
    pre_user = pre_user_repo.create(PreRegisteredUser(
        academic_id="222203831",
        assigned_year=2023,
        assigned_period=1
    ))
    user_input = PreRegisteredUserInputUpdate(
        academic_id=str(pre_user.academic_id),
        assigned_year=2026,
        assigned_period=pre_user.assigned_period
    )
    result = update_pre_registered_user(pre_user.academic_id, user_input, db_session)
    assert result["assigned_year"] == 2026

def test_delete_pre_registered_user(db_session: Session):
    pre_user_repo = PreRegisteredUserRepo(db_session)
    pre_user = pre_user_repo.create(PreRegisteredUser(
        academic_id=888888888,
        assigned_year=2023,
        assigned_period=1
    ))
    assert delete_pre_registered_user(pre_user.academic_id, db_session) is True

# *-------------------------------------------------------------------------------------------------------------*

def test_create_user(db_session: Session):
    user_input = UserInput(
        academic_id="222203869",
        first_name="John",
        last_name="Doe",
        second_last_name="Smith",
        email="john.doe@example.com",
        password="securepassword",
        profile_photo="foto.jpg",
        is_admin=False,
        is_super_admin=False
    )
    result = create_user(user_input, db_session)
    assert result["academic_id"] == "222203869"
    assert result["email"] == "john.doe@example.com"
    assert result["is_admin"] is False
    
def test_get_user(db_session: Session):
    user_repo = UserRepo(db_session)
    user = user_repo.create(User(
        academic_id="228203830",
        first_name="Alice",
        last_name="Brown",
        second_last_name="Johnson",
        email="alice.brown@example.com",
        password="hashedpass",
        profile_photo="None",
        is_admin=True,
        is_super_admin=False
    ))
    result = get_user(user.user_id, db_session)
    assert result is not None
    assert result["email"] == "alice.brown@example.com"

def test_update_user(db_session: Session):
    user_repo = UserRepo(db_session)
    user = user_repo.create(User(
        academic_id="221203840",
        first_name="Bob",
        last_name="Marley",
        second_last_name="King",
        email="bob.marley@example.com",
        password="hashedpass",
        profile_photo="None",
        is_admin=False,
        is_super_admin=False
    ))
    user_input = UserInputUpdate(email="bob.new@example.com")
    result = update_user(user.user_id, user_input, db_session)
    assert result["email"] == "bob.new@example.com"

def test_delete_user(db_session: Session):
    user_repo = UserRepo(db_session)
    user = user_repo.create(User(
        academic_id="224203890",
        first_name="Charlie",
        last_name="Chaplin",
        second_last_name="Comedian",
        email="charlie@example.com",
        password="hashedpass",
        profile_photo="None",
        is_admin=False,
        is_super_admin=False
    ))
    assert delete_user(user.user_id, db_session) is True
