from core.settings import settings
from tests.conftest import auth


def test_existing_users_must_accept_current_privacy_notice(client, student, monkeypatch):
    headers = auth(student)
    me = client.get("/users/me", headers=headers).json()
    assert me["privacy_notice_accepted"] is False and me["privacy_notice_version"] is None

    accepted = client.post("/users/me/privacy-notice/accept", headers=headers)
    assert accepted.status_code == 200
    assert accepted.json()["privacy_notice_accepted"] is True
    assert accepted.json()["privacy_notice_version"] == settings.PRIVACY_NOTICE_VERSION

    # Una versión nueva del aviso pide aceptarlo otra vez.
    monkeypatch.setattr(settings, "PRIVACY_NOTICE_VERSION", "2099-01")
    assert client.get("/users/me", headers=headers).json()["privacy_notice_accepted"] is False
    assert client.post("/users/me/privacy-notice/accept", headers=headers).json()["privacy_notice_accepted"] is True


def test_admins_see_privacy_acceptance_of_users(client, admin, student):
    client.post("/users/me/privacy-notice/accept", headers=auth(student))
    listed = {u["email"]: u["privacy_notice_accepted"] for u in client.get("/users", headers=auth(admin)).json()}
    assert listed == {"alumno@unison.mx": True, "admin@unison.mx": False}
