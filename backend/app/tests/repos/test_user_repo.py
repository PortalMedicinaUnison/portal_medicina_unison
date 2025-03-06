from repos.user import UserRepo
from models.user import User

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

    user_from_db = repo.get_by_id(1)
    
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

    user_from_db = repo.get_by_academic_id("222203833")
    
    assert user_from_db is not None
    assert user_from_db.name == "Another User"
