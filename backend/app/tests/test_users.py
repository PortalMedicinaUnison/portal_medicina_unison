from core.settings import settings
from tests.conftest import JPEG_BYTES, PASSWORD, PNG_BYTES, auth


def test_admin_lists_and_searches_users(client, admin, student, other_student):
    headers = auth(admin)
    assert len(client.get("/users", headers=headers).json()) == 3
    students = client.get("/users", params={"is_admin": False}, headers=headers).json()
    assert {u["academic_id"] for u in students} == {"222000001", "222000002"}
    found = client.get("/users", params={"q": "otro@"}, headers=headers).json()
    assert [u["email"] for u in found] == ["otro@unison.mx"]
    assert client.get(f"/users/{student.user_id}", headers=headers).json()["role"] == "student"


def test_update_own_profile(client, student, other_student):
    headers = auth(student)
    updated = client.patch("/users/me", json={"first_name": "  Luisa ", "phone_number": "6621234567"}, headers=headers)
    assert updated.status_code == 200
    assert updated.json()["first_name"] == "Luisa" and updated.json()["phone_number"] == "6621234567"
    assert client.patch("/users/me", json={"email": "otro@unison.mx"}, headers=headers).status_code == 409
    assert client.patch("/users/me", json={"phone_number": "123"}, headers=headers).status_code == 422
    assert client.patch("/users/me", json={"first_name": None}, headers=headers).status_code == 422
    # Los campos de rol no se pueden tocar desde el perfil.
    escalated = client.patch("/users/me", json={"is_admin": True, "is_super_admin": True}, headers=headers)
    assert escalated.status_code == 200 and escalated.json()["role"] == "student"


def test_change_password(client, student):
    headers = auth(student)
    wrong = client.put("/users/me/password", headers=headers, json={
        "current_password": "Otra1234", "new_password": "NuevaClave1", "confirm_password": "NuevaClave1"})
    assert wrong.status_code == 400
    mismatch = client.put("/users/me/password", headers=headers, json={
        "current_password": PASSWORD, "new_password": "NuevaClave1", "confirm_password": "NuevaClave2"})
    assert mismatch.status_code == 422 and mismatch.json()["detail"] == "Las contraseñas no coinciden."
    ok = client.put("/users/me/password", headers=headers, json={
        "current_password": PASSWORD, "new_password": "NuevaClave1", "confirm_password": "NuevaClave1"})
    assert ok.status_code == 200
    # Las demás sesiones se cierran; la actual sigue con el token nuevo.
    assert client.get("/users/me", headers=headers).status_code == 401
    new_headers = {"Authorization": f"Bearer {ok.json()['access_token']}"}
    assert client.get("/users/me", headers=new_headers).status_code == 200
    assert client.post("/auth/login", json={"email": "alumno@unison.mx", "password": PASSWORD}).status_code == 401
    assert client.post("/auth/login", json={"email": "alumno@unison.mx", "password": "NuevaClave1"}).status_code == 200


def test_roles(client, admin, super_admin, student):
    promoted = client.patch(f"/users/{student.user_id}/role", json={"is_admin": True}, headers=auth(super_admin))
    assert promoted.status_code == 200 and promoted.json()["role"] == "admin"
    assert client.patch(f"/users/{super_admin.user_id}/role", json={"is_admin": False}, headers=auth(super_admin)).status_code == 400
    # Un admin no puede editar ni desactivar a otro admin.
    assert client.patch(f"/users/{student.user_id}", json={"first_name": "X"}, headers=auth(admin)).status_code == 403
    assert client.delete(f"/users/{student.user_id}", headers=auth(admin)).status_code == 403


def test_admin_deactivates_student(client, admin, student):
    assert client.delete(f"/users/{admin.user_id}", headers=auth(admin)).status_code == 400
    assert client.delete(f"/users/{student.user_id}", headers=auth(admin)).status_code == 204
    # La coordinación sigue viendo la cuenta (desactivada) para poder reactivarla.
    assert client.get(f"/users/{student.user_id}", headers=auth(admin)).json()["is_active"] is False
    assert student.user_id not in {u["user_id"] for u in client.get("/users", headers=auth(admin)).json()}


def test_enrollments(client, admin):
    headers = auth(admin)
    created = client.post("/enrollments", json={"academic_id": "223456789"}, headers=headers)
    assert created.status_code == 201
    assert client.post("/enrollments", json={"academic_id": "223456789"}, headers=headers).status_code == 409
    invalid = client.post("/enrollments", json={"academic_id": "123"}, headers=headers)
    assert invalid.status_code == 422 and invalid.json()["detail"] == "El expediente debe tener 9 dígitos."

    bulk = client.post("/enrollments/bulk", headers=headers, json={
        "academic_ids": ["223456789", "224000001", " 224000002 ", "abc", "224000001", ""]})
    assert bulk.status_code == 200
    assert bulk.json() == {"created": ["224000001", "224000002"], "skipped": ["223456789"], "invalid": ["abc"]}

    listing = client.get("/enrollments", params={"is_enrolled": False}, headers=headers).json()
    assert len(listing) == 3
    enrollment_id = created.json()["enrollment_id"]
    assert client.delete(f"/enrollments/{enrollment_id}", headers=headers).status_code == 204
    assert client.post("/enrollments", json={"academic_id": "223456789"}, headers=headers).status_code == 201


def test_profile_photo(client, admin, student, other_student):
    headers = auth(student)
    assert client.get("/users/me", headers=headers).json()["has_photo"] is False
    not_image = client.put("/users/me/photo", headers=headers, files={"file": ("foto.png", b"%PDF-1.4 no", "image/png")})
    assert not_image.status_code == 400
    too_big = client.put("/users/me/photo", headers=headers,
                         files={"file": ("big.png", PNG_BYTES + b"0" * (1024 * 1024), "image/png")})
    assert too_big.status_code == 413

    uploaded = client.put("/users/me/photo", headers=headers, files={"file": ("yo.png", PNG_BYTES, "image/png")})
    assert uploaded.status_code == 200 and uploaded.json()["has_photo"] is True

    own = client.get(f"/users/{student.user_id}/photo", headers=headers)
    assert own.status_code == 200 and own.content == PNG_BYTES and own.headers["content-type"] == "image/png"
    assert client.get(f"/users/{student.user_id}/photo", headers=auth(admin)).status_code == 200
    assert client.get(f"/users/{student.user_id}/photo", headers=auth(other_student)).status_code == 404

    # Reemplazar la foto borra el archivo anterior.
    photos_dir = settings.UPLOAD_DIR / "profile-photos"
    own_png = {p for p in photos_dir.iterdir() if p.suffix == ".png"}
    replaced = client.put("/users/me/photo", headers=headers, files={"file": ("yo.jpg", JPEG_BYTES, "image/jpeg")})
    assert replaced.status_code == 200
    assert not any(p.exists() for p in own_png)
    assert client.get(f"/users/{student.user_id}/photo", headers=headers).headers["content-type"] == "image/jpeg"

    removed = client.delete("/users/me/photo", headers=headers)
    assert removed.status_code == 200 and removed.json()["has_photo"] is False
    assert client.get(f"/users/{student.user_id}/photo", headers=headers).status_code == 404


def test_admin_reactivates_users(client, admin, super_admin, student, make_user):
    headers = auth(admin)
    assert client.delete(f"/users/{student.user_id}", headers=headers).status_code == 204
    assert client.delete(f"/users/{student.user_id}", headers=headers).status_code == 409
    assert student.user_id not in {u["user_id"] for u in client.get("/users", headers=headers).json()}
    everyone = client.get("/users", params={"include_inactive": True}, headers=headers).json()
    assert next(u for u in everyone if u["user_id"] == student.user_id)["is_active"] is False
    assert client.get(f"/users/{student.user_id}", headers=headers).json()["is_active"] is False

    reactivated = client.post(f"/users/{student.user_id}/reactivate", headers=headers)
    assert reactivated.status_code == 200 and reactivated.json()["is_active"] is True
    assert client.post(f"/users/{student.user_id}/reactivate", headers=headers).status_code == 409
    assert client.post("/auth/login", json={"email": "alumno@unison.mx", "password": PASSWORD}).status_code == 200

    other_admin = make_user("otro.admin@unison.mx", is_admin=True)
    client.delete(f"/users/{other_admin.user_id}", headers=auth(super_admin))
    assert client.post(f"/users/{other_admin.user_id}/reactivate", headers=headers).status_code == 403
    assert client.post(f"/users/{other_admin.user_id}/reactivate", headers=auth(super_admin)).status_code == 200
