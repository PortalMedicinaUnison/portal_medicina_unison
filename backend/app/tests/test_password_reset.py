from datetime import timedelta

import pytest

from core.settings import settings
from models.base import utcnow
from models.password_reset import PasswordResetToken
from tests.conftest import PASSWORD, auth
from utils import mailer

NEW_PASSWORD = "NuevaClave1"


def _confirm(client, token, password=NEW_PASSWORD):
    return client.post("/auth/password-reset/confirm", json={
        "token": token, "new_password": password, "confirm_password": password,
    })


def _login(client, email, password):
    return client.post("/auth/login", json={"email": email, "password": password})


@pytest.fixture()
def email_enabled(monkeypatch):
    """Activa el correo y captura los mensajes en lugar de enviarlos."""
    monkeypatch.setattr(settings, "SMTP_HOST", "smtp.prueba.local")
    monkeypatch.setattr(settings, "SMTP_FROM", "portal@prueba.local")
    monkeypatch.setattr(settings, "FRONTEND_URL", "https://portal.prueba.local/")
    sent = []
    monkeypatch.setattr(mailer, "send_email", lambda to, subject, body: sent.append((to, subject, body)) or True)
    return sent


def _token_from(body: str) -> str:
    line = next(line for line in body.splitlines() if "/reset-password?token=" in line)
    assert line.startswith("https://portal.prueba.local/reset-password?token=")
    return line.split("token=", 1)[1]


# ---------------------- ENLACE GENERADO POR LA COORDINACIÓN ----------------------

def test_admin_link_resets_password_once_and_closes_sessions(client, db, admin, student):
    old_session = auth(student)
    response = client.post(f"/users/{student.user_id}/password-reset", headers=auth(admin))
    assert response.status_code == 201, response.text
    token = response.json()["token"]
    assert response.json()["expires_at"].endswith("Z") or "+00:00" in response.json()["expires_at"]

    # En la BD solo queda el hash del token.
    stored = db.query(PasswordResetToken).one()
    assert stored.token_hash != token and len(stored.token_hash) == 64
    assert stored.created_by_id == admin.user_id

    info = client.post("/auth/password-reset/verify", json={"token": token})
    assert info.status_code == 200 and info.json()["email"] == "alumno@unison.mx"

    mismatch = client.post("/auth/password-reset/confirm", json={
        "token": token, "new_password": NEW_PASSWORD, "confirm_password": "OtraClave1"})
    assert mismatch.status_code == 422
    weak = _confirm(client, token, password="abc")
    assert weak.status_code == 422

    assert _confirm(client, token).status_code == 204
    assert client.get("/users/me", headers=old_session).status_code == 401
    assert _login(client, "alumno@unison.mx", PASSWORD).status_code == 401
    assert _login(client, "alumno@unison.mx", NEW_PASSWORD).status_code == 200

    # Un solo uso.
    reused = _confirm(client, token, password="OtraClave2")
    assert reused.status_code == 400 and "no es válido o ya expiró" in reused.json()["detail"]
    assert client.post("/auth/password-reset/verify", json={"token": token}).status_code == 400


def test_new_link_replaces_previous_and_links_expire(client, db, admin, student):
    first = client.post(f"/users/{student.user_id}/password-reset", headers=auth(admin)).json()["token"]
    second = client.post(f"/users/{student.user_id}/password-reset", headers=auth(admin)).json()["token"]
    assert client.post("/auth/password-reset/verify", json={"token": first}).status_code == 400
    assert client.post("/auth/password-reset/verify", json={"token": second}).status_code == 200

    db.query(PasswordResetToken).update({PasswordResetToken.expires_at: utcnow() - timedelta(minutes=1)})
    db.commit()
    assert _confirm(client, second).status_code == 400
    assert client.post("/auth/password-reset/verify", json={"token": "inventado"}).status_code == 400
    assert client.post("/auth/password-reset/verify", json={"token": ""}).status_code == 400


def test_reset_link_rules_for_staff_and_inactive_accounts(client, admin, super_admin, student, make_user):
    other_admin = make_user("otra.admin@unison.mx", is_admin=True)
    assert client.post(f"/users/{other_admin.user_id}/password-reset", headers=auth(admin)).status_code == 403
    assert client.post(f"/users/{super_admin.user_id}/password-reset", headers=auth(admin)).status_code == 403
    assert client.post(f"/users/{other_admin.user_id}/password-reset", headers=auth(super_admin)).status_code == 201
    assert client.post("/users/9999/password-reset", headers=auth(admin)).status_code == 404

    assert client.delete(f"/users/{student.user_id}", headers=auth(admin)).status_code == 204
    inactive = client.post(f"/users/{student.user_id}/password-reset", headers=auth(admin))
    assert inactive.status_code == 409


def test_link_of_deactivated_account_stops_working(client, admin, student):
    token = client.post(f"/users/{student.user_id}/password-reset", headers=auth(admin)).json()["token"]
    assert client.delete(f"/users/{student.user_id}", headers=auth(admin)).status_code == 204
    assert _confirm(client, token).status_code == 400


def test_changing_password_invalidates_pending_links(client, admin, student):
    token = client.post(f"/users/{student.user_id}/password-reset", headers=auth(admin)).json()["token"]
    changed = client.put("/users/me/password", headers=auth(student), json={
        "current_password": PASSWORD, "new_password": NEW_PASSWORD, "confirm_password": NEW_PASSWORD})
    assert changed.status_code == 200
    assert _confirm(client, token, password="OtraClave2").status_code == 400


# ---------------------- POR CORREO (opcional) ----------------------

def test_email_reset_disabled_by_default(client, student):
    assert client.get("/auth/password-reset/options").json() == {"email_enabled": False, "email_link_minutes": 60}
    response = client.post("/auth/password-reset/request", json={"email": "alumno@unison.mx"})
    assert response.status_code == 400
    assert "coordinación" in response.json()["detail"]


def test_email_reset_flow(client, student, email_enabled):
    assert client.get("/auth/password-reset/options").json()["email_enabled"] is True

    response = client.post("/auth/password-reset/request", json={"email": " ALUMNO@unison.mx "})
    assert response.status_code == 202
    assert len(email_enabled) == 1
    to, subject, body = email_enabled[0]
    assert to == "alumno@unison.mx" and "Restablecer contraseña" in subject
    assert f"{settings.PASSWORD_RESET_EMAIL_MINUTES} minutos" in body

    assert _confirm(client, _token_from(body)).status_code == 204
    assert _login(client, "alumno@unison.mx", NEW_PASSWORD).status_code == 200


def test_email_reset_does_not_reveal_accounts(client, admin, student, email_enabled):
    known = client.post("/auth/password-reset/request", json={"email": "alumno@unison.mx"})
    unknown = client.post("/auth/password-reset/request", json={"email": "nadie@unison.mx"})
    assert known.status_code == unknown.status_code == 202
    assert known.json() == unknown.json()
    assert [to for to, _, _ in email_enabled] == ["alumno@unison.mx"]

    # Las cuentas desactivadas tampoco reciben correo.
    assert client.delete(f"/users/{student.user_id}", headers=auth(admin)).status_code == 204
    email_enabled.clear()
    client.post("/auth/password-reset/request", json={"email": "alumno@unison.mx"})
    assert email_enabled == []


def test_email_reset_is_throttled_per_user(client, db, student, email_enabled):
    for _ in range(3):
        assert client.post("/auth/password-reset/request", json={"email": "alumno@unison.mx"}).status_code == 202
    assert len(email_enabled) == 1
    first_token = _token_from(email_enabled[0][2])

    db.query(PasswordResetToken).update({PasswordResetToken.created_at: utcnow() - timedelta(minutes=10)})
    db.commit()
    client.post("/auth/password-reset/request", json={"email": "alumno@unison.mx"})
    assert len(email_enabled) == 2
    # El enlace nuevo reemplaza al anterior.
    assert _confirm(client, first_token).status_code == 400
    assert _confirm(client, _token_from(email_enabled[1][2])).status_code == 204


# ---------------------- ENVÍO SMTP ----------------------

class FakeSMTP:
    instances = []

    def __init__(self, host, port, timeout=None, **_kwargs):
        self.host, self.port, self.calls, self.messages = host, port, [], []
        FakeSMTP.instances.append(self)

    def __enter__(self):
        return self

    def __exit__(self, *_exc):
        return False

    def starttls(self, context=None):
        self.calls.append("starttls")

    def login(self, user, password):
        self.calls.append(("login", user, password))

    def send_message(self, message):
        self.messages.append(message)


def test_send_email_uses_starttls_and_login(monkeypatch):
    FakeSMTP.instances.clear()
    monkeypatch.setattr(mailer.smtplib, "SMTP", FakeSMTP)
    monkeypatch.setattr(settings, "SMTP_HOST", "smtp.gmail.com")
    monkeypatch.setattr(settings, "SMTP_FROM", "Portal Medicina <portal@prueba.local>")
    monkeypatch.setattr(settings, "SMTP_USER", "portal@prueba.local")
    monkeypatch.setattr(settings, "SMTP_PASSWORD", "clave-de-aplicacion")

    assert mailer.send_email("ana@unison.mx", "Asunto", "Cuerpo con acentos: contraseña") is True
    server = FakeSMTP.instances[0]
    assert (server.host, server.port) == ("smtp.gmail.com", 587)
    assert server.calls == ["starttls", ("login", "portal@prueba.local", "clave-de-aplicacion")]
    message = server.messages[0]
    assert message["To"] == "ana@unison.mx" and message["Subject"] == "Asunto"
    assert "contraseña" in message.get_content()


def test_send_email_failures_are_logged_not_raised(monkeypatch):
    def broken(*_args, **_kwargs):
        raise OSError("sin conexión")

    monkeypatch.setattr(mailer.smtplib, "SMTP", broken)
    monkeypatch.setattr(settings, "SMTP_HOST", "smtp.prueba.local")
    monkeypatch.setattr(settings, "SMTP_FROM", "portal@prueba.local")
    assert mailer.send_email("ana@unison.mx", "Asunto", "Cuerpo") is False

    monkeypatch.setattr(settings, "SMTP_HOST", None)
    assert mailer.send_email("ana@unison.mx", "Asunto", "Cuerpo") is False
