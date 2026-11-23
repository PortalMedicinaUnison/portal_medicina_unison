from tests.conftest import PASSWORD, auth


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
    assert ok.status_code == 204
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
    assert client.get(f"/users/{student.user_id}", headers=auth(admin)).status_code == 404


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
