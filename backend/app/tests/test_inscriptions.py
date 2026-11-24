from tests.conftest import auth
from tests.test_social_service import _accredit_internship, ss_catalog  # noqa: F401 (fixture)


def _bulk(client, admin, promotion_id, rows, base="/internship-applications"):
    response = client.post(f"{base}/bulk", headers=auth(admin), json={"promotion_id": promotion_id, "students": rows})
    assert response.status_code == 200, response.text
    return response.json()


def _accept(client, student, application_id, base="/internship-applications"):
    response = client.post(f"{base}/{application_id}/accept", headers=auth(student))
    assert response.status_code == 200, response.text
    return response.json()


def test_bulk_assignment_reports_each_student(client, admin, student, other_student, catalog):
    promotion_id = catalog["promotion"]["promotion_id"]
    result = _bulk(client, admin, promotion_id, [
        {"academic_id": " 222000001 ", "average": 92.346},
        {"academic_id": "222000002"},
        {"academic_id": "222000001"},          # repetido: se ignora
        {"academic_id": "222999999"},          # no registrado
        {"academic_id": "12345"},              # formato inválido
    ])
    assert result["created"] == ["222000001", "222000002"]
    reasons = {row["academic_id"]: row["reason"] for row in result["skipped"]}
    assert reasons["222999999"] == "No hay un estudiante registrado con ese expediente."
    assert "9 dígitos" in reasons["12345"]

    listed = client.get("/internship-applications", params={"promotion_id": promotion_id}, headers=auth(admin)).json()
    averages = {a["academic_id"]: a["average"] for a in listed}
    assert averages == {"222000001": 92.35, "222000002": None}

    # Volver a pegar la lista con promedios solo actualiza.
    again = _bulk(client, admin, promotion_id, [{"academic_id": "222000002", "average": 88}, {"academic_id": "222000001"}])
    assert again["created"] == [] and again["updated"] == ["222000002"]
    assert again["skipped"] == [{"academic_id": "222000001", "reason": "Ya está asignado a esta promoción."}]

    wrong_program = client.post("/social-service-applications/bulk", headers=auth(admin),
                                json={"promotion_id": promotion_id, "students": [{"academic_id": "222000001"}]})
    assert wrong_program.status_code == 400


def test_candidates_and_average_update(client, admin, student, other_student, catalog):
    promotion_id = catalog["promotion"]["promotion_id"]
    url = "/internship-applications/candidates"
    names = lambda: [u["academic_id"] for u in client.get(url, params={"promotion_id": promotion_id}, headers=auth(admin)).json()]  # noqa: E731
    assert names() == ["222000001", "222000002"]

    created = client.post("/internship-applications", headers=auth(admin),
                          json={"promotion_id": promotion_id, "academic_id": "222000001", "average": 90.5}).json()
    assert created["average"] == 90.5 and names() == ["222000002"]

    patched = client.patch(f"/internship-applications/{created['application_id']}", headers=auth(admin), json={"average": 95.129})
    assert patched.status_code == 200 and patched.json()["average"] == 95.13
    assert patched.json()["inscription_progress"] is not None
    assert client.patch(f"/internship-applications/{created['application_id']}", headers=auth(admin),
                        json={"average": 101}).status_code == 422
    assert client.patch("/internship-applications/9999", headers=auth(admin), json={"average": 80}).status_code == 404


def test_accredited_students_cannot_repeat_the_internship(client, admin, student, ss_catalog):  # noqa: F811
    _accredit_internship(client, admin, student, ss_catalog)
    again = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": ss_catalog["promotion"]["promotion_id"], "academic_id": student.academic_id})
    assert again.status_code == 409 and again.json()["detail"] == "El estudiante ya acreditó el internado."

    # Para servicio social sí es candidato (y solo quien acreditó el internado).
    ss_candidates = client.get("/social-service-applications/candidates",
                               params={"promotion_id": ss_catalog["ss_promotion"]["promotion_id"]}, headers=auth(admin)).json()
    assert [u["academic_id"] for u in ss_candidates] == [student.academic_id]


def test_plaza_results_apply_the_same_rules(client, admin, student, other_student, make_user, catalog):
    promotion_id = catalog["promotion"]["promotion_id"]
    third = make_user("tercero@unison.mx", academic_id="222000003")
    _bulk(client, admin, promotion_id, [{"academic_id": a} for a in ("222000001", "222000002", "222000003")])
    apps = {a["academic_id"]: a for a in client.get("/internship-applications", headers=auth(admin)).json()}
    _accept(client, student, apps["222000001"]["application_id"])
    _accept(client, other_student, apps["222000002"]["application_id"])
    site_a = catalog["site_a"]["site_id"]  # cupo 1 en la promoción

    response = client.post("/internship-applications/plaza-results", headers=auth(admin), json={"results": [
        {"application_id": apps["222000001"]["application_id"], "site_id": site_a},
        {"application_id": apps["222000002"]["application_id"], "site_id": site_a},
        {"application_id": apps["222000003"]["application_id"], "site_id": site_a},
        {"application_id": 9999, "site_id": site_a},
    ]})
    assert response.status_code == 200, response.text
    rows = response.json()
    assert [r["ok"] for r in rows] == [True, False, False, False]
    assert "ya no tiene cupo" in rows[1]["detail"]
    assert rows[2]["detail"] == "Aún no acepta su asignación."
    assert "no encontrada" in rows[3]["detail"]

    listed = {a["academic_id"]: a for a in client.get("/internship-applications", headers=auth(admin)).json()}
    assert listed["222000001"]["internship"]["site"]["site_id"] == site_a
    assert listed["222000002"]["internship"]["site"] is None
    assert listed["222000003"]["internship"] is None
    assert third.academic_id == "222000003"

    # Quitar la sede libera el cupo para el siguiente.
    cleared = client.post("/internship-applications/plaza-results", headers=auth(admin), json={"results": [
        {"application_id": apps["222000001"]["application_id"], "site_id": None},
        {"application_id": apps["222000002"]["application_id"], "site_id": site_a},
    ]})
    assert [r["ok"] for r in cleared.json()] == [True, True]


def test_social_service_bulk_and_plaza_results(client, admin, student, ss_catalog):  # noqa: F811
    _accredit_internship(client, admin, student, ss_catalog)
    ss_promotion = ss_catalog["ss_promotion"]["promotion_id"]
    base = "/social-service-applications"
    result = _bulk(client, admin, ss_promotion, [{"academic_id": student.academic_id, "average": 91}], base=base)
    assert result["created"] == [student.academic_id]
    application = client.get(base, headers=auth(admin)).json()[0]
    _accept(client, student, application["application_id"], base=base)

    rows = client.post(f"{base}/plaza-results", headers=auth(admin), json={"results": [
        {"application_id": application["application_id"], "site_id": ss_catalog["site_b"]["site_id"]},
    ]}).json()
    assert rows == [{"application_id": application["application_id"], "ok": True, "detail": None}]
    listed = client.get(base, headers=auth(admin)).json()[0]
    assert listed["social_service"]["site"]["site_id"] == ss_catalog["site_b"]["site_id"] and listed["average"] == 91
