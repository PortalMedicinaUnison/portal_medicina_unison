from datetime import timedelta

from core.security import create_access_token
from tests.conftest import PASSWORD, auth

REGISTER = {
    "academic_id": "222111111", "first_name": "Ana", "last_name": "López",
    "email": "Ana@Unison.mx", "password": "Password1",
}


def _enroll(client, admin, academic_id="222111111"):
    response = client.post("/enrollments", json={"academic_id": academic_id}, headers=auth(admin))
    assert response.status_code == 201, response.text
    return response.json()


def test_register_requires_enrollment(client):
    response = client.post("/auth/register", json=REGISTER)
    assert response.status_code == 400
    assert "pre-registrado" in response.json()["detail"]


def test_register_creates_student_and_marks_enrollment(client, admin):
    enrollment = _enroll(client, admin)
    response = client.post("/auth/register", json={**REGISTER, "is_admin": True, "is_super_admin": True})
    assert response.status_code == 201, response.text
    user = response.json()
    assert user["role"] == "student" and user["is_admin"] is False and user["is_super_admin"] is False
    assert user["email"] == "ana@unison.mx"
    assert "password" not in user

    refreshed = client.get(f"/enrollments/{enrollment['enrollment_id']}", headers=auth(admin)).json()
    assert refreshed["is_enrolled"] is True


def test_register_rejects_duplicates(client, admin):
    _enroll(client, admin)
    assert client.post("/auth/register", json=REGISTER).status_code == 201
    again = client.post("/auth/register", json=REGISTER)
    assert again.status_code == 409


def test_register_validates_password_and_email_with_readable_message(client, admin):
    _enroll(client, admin)
    weak = client.post("/auth/register", json={**REGISTER, "password": "abc"})
    assert weak.status_code == 422
    assert weak.json()["detail"] == "La contraseña debe tener al menos 8 caracteres."
    bad_email = client.post("/auth/register", json={**REGISTER, "email": "no-es-email"})
    assert bad_email.status_code == 422
    assert bad_email.json()["detail"] == "El correo electrónico no es válido."
    missing = client.post("/auth/register", json={"academic_id": "222111111"})
    assert missing.status_code == 422
    assert "Nombre: es obligatorio." in missing.json()["detail"]


def test_login_and_me(client, student):
    response = client.post("/auth/login", json={"email": " ALUMNO@unison.mx ", "password": PASSWORD})
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    me = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["academic_id"] == "222000001"


def test_login_with_wrong_password(client, student):
    response = client.post("/auth/login", json={"email": "alumno@unison.mx", "password": "Incorrecta1"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Correo o contraseña incorrectos."


def test_expired_and_invalid_tokens_are_rejected(client, student):
    expired = create_access_token(student.user_id, expires_delta=timedelta(minutes=-1))
    assert client.get("/users/me", headers={"Authorization": f"Bearer {expired}"}).status_code == 401
    assert client.get("/users/me", headers={"Authorization": "Bearer basura"}).status_code == 401


def test_refresh_token(client, student):
    response = client.post("/auth/refresh", headers=auth(student))
    assert response.status_code == 200
    assert client.get("/users/me", headers={"Authorization": f"Bearer {response.json()['access_token']}"}).status_code == 200


def test_deactivated_user_cannot_login_or_use_token(client, student):
    headers = auth(student)
    assert client.delete("/users/me", headers=headers).status_code == 204
    assert client.get("/users/me", headers=headers).status_code == 401
    assert client.post("/auth/login", json={"email": "alumno@unison.mx", "password": PASSWORD}).status_code == 401
