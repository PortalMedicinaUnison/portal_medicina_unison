from utils.security import hash_password, verify_password, get_user_role

# Clase Dummy para simular un usuario.
class DummyUser:
    def __init__(self, is_super_admin=False, is_admin=False):
        self.is_super_admin = is_super_admin
        self.is_admin = is_admin

# Tests para hash_password
def test_hash_password():
    password = "miSecreto123"
    hashed = hash_password(password)
    # Verificamos que se genera una cadena y que no es igual al texto plano.
    assert isinstance(hashed, str)
    assert hashed != password

# Tests para verify_password
def test_verify_password_success():
    password = "miSecreto123"
    hashed = hash_password(password)
    # Debería verificar correctamente cuando la contraseña es la correcta.
    assert verify_password(password, hashed) is True

def test_verify_password_failure():
    password = "miSecreto123"
    wrong_password = "otraContraseña"
    hashed = hash_password(password)
    # La verificación debe fallar si la contraseña no coincide.
    assert verify_password(wrong_password, hashed) is False

# Tests para get_user_role
def test_get_user_role_super_admin():
    # Cuando el usuario es super administrador.
    user = DummyUser(is_super_admin=True, is_admin=True)
    role = get_user_role(user)
    assert role == "super_admin"

def test_get_user_role_admin():
    # Cuando el usuario es solo administrador.
    user = DummyUser(is_super_admin=False, is_admin=True)
    role = get_user_role(user)
    assert role == "admin"

def test_get_user_role_student():
    # Cuando el usuario no es ni administrador ni super administrador.
    user = DummyUser(is_super_admin=False, is_admin=False)
    role = get_user_role(user)
    assert role == "student"