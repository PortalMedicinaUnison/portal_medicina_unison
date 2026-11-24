from datetime import date, timedelta

from tests.conftest import auth


def test_announcements_visibility(client, admin, student):
    headers = auth(admin)
    visible = client.post("/announcements", json={"title": "Bienvenida", "announcement_type": 1, "description": "Hola"}, headers=headers)
    assert visible.status_code == 201, visible.text
    assert visible.json()["created_at"].endswith("Z") or "+00:00" in visible.json()["created_at"]
    hidden = client.post("/announcements", json={
        "title": "Borrador", "announcement_type": 2, "description": "Pendiente", "is_visible": False}, headers=headers).json()

    assert len(client.get("/announcements", headers=headers).json()) == 2
    assert [a["title"] for a in client.get("/announcements", headers=auth(student)).json()] == ["Bienvenida"]
    assert client.get(f"/announcements/{hidden['announcement_id']}", headers=auth(student)).status_code == 404
    assert client.post("/announcements", json={"title": "Sin texto", "announcement_type": 1}, headers=headers).status_code == 422

    updated = client.patch(f"/announcements/{hidden['announcement_id']}", json={"is_visible": True}, headers=headers)
    assert updated.status_code == 200 and updated.json()["announcement_type"] == 2
    assert client.delete(f"/announcements/{hidden['announcement_id']}", headers=headers).status_code == 204


def test_surveys(client, admin, student):
    headers = auth(admin)
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    created = client.post("/surveys", json={
        "title": "Satisfacción", "url": "https://forms.gle/abc", "expiration_date": tomorrow, "mandatory": True}, headers=headers)
    # Regresión: en main crear una encuesta siempre fallaba (500) por guardar un HttpUrl.
    assert created.status_code == 201, created.text
    survey = created.json()
    assert survey["url"] == "https://forms.gle/abc" and survey["description"] is None

    updated = client.patch(f"/surveys/{survey['survey_id']}", json={"url": "https://forms.gle/xyz"}, headers=headers)
    assert updated.status_code == 200 and updated.json()["url"] == "https://forms.gle/xyz"
    assert client.post("/surveys", json={
        "title": "Vieja", "url": "https://x.mx", "expiration_date": "2020-01-01"}, headers=headers).status_code == 422
    assert client.post("/surveys", json={
        "title": "Mala", "url": "ftp://x", "expiration_date": tomorrow}, headers=headers).status_code == 422

    client.post("/surveys", json={"title": "Oculta", "url": "https://x.mx", "expiration_date": tomorrow, "is_visible": False}, headers=headers)
    assert [s["title"] for s in client.get("/surveys", headers=auth(student)).json()] == ["Satisfacción"]
    assert len(client.get("/surveys", headers=headers).json()) == 2
