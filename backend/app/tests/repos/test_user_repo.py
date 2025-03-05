import pytest
from repos.user import UserRepo, PreRegisteredUserRepo
from models.user import User, PreRegisteredUser
from fastapi import UploadFile
from io import BytesIO

def test_create_user(db_session):
    """Prueba la creación de un usuario en la base de datos."""
    repo = UserRepo(db_session)
    
    new_user = User(
        user_id=1,
        academic_id="222203834",
        first_name="Test User",
        last_name="Doe",
        second_last_name=None,
        email="test@example.com",
        password="securepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )
    repo.create(new_user)

    user_from_db = repo.get_by_user_id(1)
    
    assert user_from_db is not None
    assert user_from_db.name == "Test User"
    assert str(user_from_db.academic_id) == "222203834"

def test_get_by_academic_id(db_session):
    """Prueba obtener un usuario por academic_id."""
    repo = UserRepo(db_session)

    user = User(
        user_id=2,
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

    repo.create(user)

    updated_data = {"name": "Updated Name", "email": "updated@example.com"}
    repo.update(user.user_id, updated_data)

    updated_user = repo.get_by_user_id(3)

    assert updated_user.name == "Updated Name"
    assert updated_user.email == "updated@example.com"

def test_update_user(db_session):
    """Prueba actualizar los datos de un usuario."""
    repo = UserRepo(db_session)

    user = User(
        user_id=3,
        academic_id="222203832",
        first_name="Update User",
        second_name="Brown",
        second_last_name="Johnson",
        email="update@example.com",
        password="updatepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )

    repo.create(user)

    updated_data = {"name": "Updated Name", "email": "updated@example.com"}
    repo.update(user.user_id, updated_data)

    updated_user = repo.get_by_user_id(3)

    assert updated_user.name == "Updated Name"
    assert updated_user.email == "updated@example.com"

def test_delete_user(db_session):
    """Prueba desactivar un usuario."""
    repo = UserRepo(db_session)

    user = User(
        user_id=4,
        academic_id="222203831",
        first_name="Delete User",
        second_name="Lee",
        second_last_name="Kim",
        email="delete@example.com",
        password="deletepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )

    repo.create(user)

    assert repo.delete(user.user_id) is True
    assert repo.get_by_user_id(4).is_active is False

def test_get_all_users(db_session):
    """Prueba obtener todos los usuarios."""
    repo = UserRepo(db_session)

    users = [
        User(user_id=5, academic_id="222203830",first_name="User One", second_name="Smith", second_last_name=None,  email="one@example.com", password="pass1", profile_photo="default.png", is_admin=False, is_super_admin=False),
        User(user_id=6, academic_id="222203829",first_name="User Two", second_name="Doe", second_last_name=None, email="two@example.com", password="pass2", profile_photo="default.png", is_admin=False, is_super_admin=False)
    ]


    for user in users:
        repo.create(user)

    all_users = repo.get_all()

    assert len(all_users) >= 2
    assert any(user.name == "User One" for user in all_users)
    assert any(user.name == "User Two" for user in all_users)

def test_upload_profile_picture(db_session, tmpdir):
    """Prueba la subida de una imagen de perfil."""
    repo = UserRepo(db_session)

    user = User(
        user_id=7,
        academic_id="222203828",
        first_name="Profile User",
        second_name = "Dow",
        second_last_name=None,
        email="profile@example.com",
        password="profilepassword",
        profile_photo="default.png",
        is_admin=False,
        is_super_admin=False
    )

    repo.create(user)

    # Simulamos un archivo de imagen
    # image_content = b"FakeImageData"
    # image_file = UploadFile(filename="profile.jpg", file=BytesIO(image_content))

    # repo.upload_profile_picture(user.user_id, image_file)

    # updated_user = repo.get_by_user_id(7)
    # assert updated_user.profile_photo.startswith("profile_images/7.jpg")

def test_create_pre_registered_user(db_session):
    """Prueba la creación de un usuario pre-registrado."""
    repo = PreRegisteredUserRepo(db_session)

    pre_user = PreRegisteredUser(
        academic_id="222203827",
        assigned_year = 2025,
        assigned_period = 2025,
    )

    repo.create(pre_user)

    user_from_db = repo.get_by_academic_id("222203827")

    assert user_from_db is not None     

def test_update_pre_registered_user(db_session):
    """Prueba actualizar un usuario pre-registrado."""
    repo = PreRegisteredUserRepo(db_session)

    pre_user = PreRegisteredUser(
        academic_id="222203826",
        assigned_year = 2025,
        assigned_period = 2025,
    )

    repo.create(pre_user)

    updated_data = {"name": "New Name", "email": "new@example.com"}
    repo.update(pre_user.academic_id, updated_data)

    updated_user = repo.get_by_academic_id("222203826")

    assert updated_user.name == "New Name"
    assert updated_user.email == "new@example.com"

def test_delete_pre_registered_user(db_session):
    """Prueba la desactivación de un usuario pre-registrado."""
    repo = PreRegisteredUserRepo(db_session)

    pre_user = PreRegisteredUser(
        academic_id="222203825",
        assigned_year = 2025,
        assigned_period = 2025,
    )

    repo.create(pre_user)

    assert repo.delete(pre_user.academic_id) is True
    assert repo.get_by_academic_id("222203825").is_active is False
