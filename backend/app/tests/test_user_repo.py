from repos.user import UserRepo
from models.user import User

def test_create_user(db_session):
    """Prueba la creación de un usuario en la base de datos."""
    repo = UserRepo(db_session)
    
    new_user = User(
        user_id=1,
        academic_id="222203834",
        name="Test User",
        paternal_last_name="Doe",  # Agrega un apellido válido
        maternal_last_name=None,  # Este campo es opcional según el modelo
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
        name="Another User",
        paternal_last_name="Smith",  # Agrega un apellido válido
        maternal_last_name=None,
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
