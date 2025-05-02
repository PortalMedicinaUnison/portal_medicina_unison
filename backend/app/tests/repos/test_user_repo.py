import pytest
from repos.user import UserRepo, PreRegisteredUserRepo
from models.user import User, PreRegisteredUser
from fastapi import UploadFile
from io import BytesIO


def test_create_user(db_session):
    """Prueba la creación de un usuario en la base de datos."""
    user_repo = UserRepo(db_session)
    
    new_user = User(
        academic_id="222203848",
        first_name="Test User",
        last_name="Doe",
        second_last_name=None,
        email="test@example.com",
        password="securepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )
    created_user = user_repo.create(new_user)

    user_from_db = user_repo.get_by_id(created_user.user_id)
    
    assert user_from_db is not None
    assert user_from_db.first_name == "Test User"
    assert str(user_from_db.academic_id) == "222203848"

def test_get_by_academic_id(db_session):
    """Prueba obtener un usuario por academic_id."""
    user_repo = UserRepo(db_session)

    user = User(
        academic_id="222203833",
        first_name="Another User",
        last_name="Smith",
        second_last_name=None,
        email="another@example.com",
        password="anotherpassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )

    user_repo.create(user)

    user_from_db = user_repo.get_by_academic_id("222203833")
    
    assert user_from_db is not None
    assert user_from_db.first_name == "Another User"

def test_update_user(db_session):
    """Prueba obtener un usuario por academic_id."""
    user_repo = UserRepo(db_session)

    user = User(
        academic_id="222203832",
        first_name="Update User",
        last_name="Brown",
        second_last_name="Johnson",
        email="update@example.com",
        password="updatepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )

    created_user = user_repo.create(user)

    updated_data = {"first_name": "Updated Name", "email": "updated@example.com"}
    user_repo.update(created_user.user_id, updated_data)

    updated_user = user_repo.get_by_id(created_user.user_id)

    assert updated_user.first_name == "Updated Name"
    assert updated_user.email == "updated@example.com"

def test_delete_user(db_session):
    """Prueba desactivar un usuario."""
    user_repo = UserRepo(db_session)

    user = User(
        academic_id="222203831",
        first_name="Delete User",
        last_name="Lee",
        second_last_name="Kim",
        email="delete@example.com",
        password="deletepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )

    created_user = user_repo.create(user)

    assert user_repo.delete(created_user.user_id) is True
    assert user_repo.get_by_id(created_user.user_id).is_active is False

def test_get_all_users(db_session):
    """Prueba obtener todos los usuarios."""
    user_repo = UserRepo(db_session)

    users = [
        User(academic_id="222203830",first_name="User One", last_name="Smith", second_last_name=None,  email="one@example.com", password="pass1", profile_photo="default.png", is_admin=False, is_super_admin=False),
        User(academic_id="222203829",first_name="User Two", last_name="Doe", second_last_name=None, email="two@example.com", password="pass2", profile_photo="default.png", is_admin=False, is_super_admin=False)
    ]


    for user in users:
        user_repo.create(user)

    all_users = user_repo.get_all()

    assert len(all_users) >= 2
    assert any(user.first_name == "User One" for user in all_users)
    assert any(user.first_name == "User Two" for user in all_users)

def test_upload_profile_picture(db_session, tmpdir):
    """Prueba la subida de una imagen de perfil."""
    user_repo = UserRepo(db_session)

    user = User(
        academic_id="222203828",
        first_name="Profile User",
        last_name = "Dow",
        second_last_name=None,
        email="profile@example.com",
        password="profilepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )

    user_repo.create(user)

    # Simulamos un archivo de imagen
    # image_content = b"FakeImageData"
    # image_file = UploadFile(filename="profile.jpg", file=BytesIO(image_content))

    # repo.upload_profile_picture(user.user_id, image_file)

    # updated_user = repo.get_by_user_id(7)
    # assert updated_user.profile_photo.startswith("profile_images/7.jpg")

def test_create_pre_registered_user(db_session):
    """Prueba la creación de un usuario pre-registrado."""
    user_repo = PreRegisteredUserRepo(db_session)

    pre_user = PreRegisteredUser(
        academic_id="222203827",
        assigned_year = 2025,
        assigned_period = 2025,
    )

    user_repo.create(pre_user)

    user_from_db = user_repo.get_by_academic_id("222203827")

    assert user_from_db is not None     

def test_update_pre_registered_user(db_session):
    """Prueba actualizar un usuario pre-registrado."""
    user_repo = PreRegisteredUserRepo(db_session)

    pre_user = PreRegisteredUser(
        academic_id="222203826",
        assigned_year = 2025,
        assigned_period = 2025,
    )

    user_repo.create(pre_user)

    updated_data = {"first_name": "New Name", "email": "new@example.com"}
    user_repo.update(pre_user.academic_id, updated_data)

    updated_user = user_repo.get_by_academic_id("222203826")

    assert updated_user.first_name == "New Name"
    assert updated_user.email == "new@example.com"

def test_delete_pre_registered_user(db_session):
    """Prueba la desactivación de un usuario pre-registrado."""
    user_repo = PreRegisteredUserRepo(db_session)

    pre_user = PreRegisteredUser(
        academic_id="222203825",
        assigned_year = 2025,
        assigned_period = 2025,
    )

    user_repo.create(pre_user)

    assert user_repo.delete(pre_user.academic_id) is True
    assert user_repo.get_by_academic_id("222203825").is_active is False
