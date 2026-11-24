from datetime import date, timedelta

from tests.conftest import auth


def _report(catalog, **overrides):
    return {
        "site_id": catalog["site_a"]["site_id"], "date_report": date.today().isoformat(),
        "report_type": 1, "description": "Me lastimé con una aguja.", **overrides,
    }


def test_student_creates_report_with_identity_from_session(client, admin, student, catalog):
    application = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": catalog["promotion"]["promotion_id"], "academic_id": student.academic_id}).json()
    internship = client.post(f"/internship-applications/{application['application_id']}/accept", headers=auth(student)).json()

    response = client.post("/reports", json=_report(catalog), headers=auth(student))
    assert response.status_code == 201, response.text
    report = response.json()
    assert report["academic_id"] == "222000001"
    assert report["internship_id"] == internship["internship_id"]
    assert report["is_open"] is True and report["site"]["name"] == "Hospital A"


def test_report_validation(client, student, catalog):
    headers = auth(student)
    other = client.post("/reports", json=_report(catalog, report_type=7), headers=headers)
    assert other.status_code == 422 and "Otro" in other.json()["detail"]
    future = client.post("/reports", json=_report(catalog, date_report=(date.today() + timedelta(days=1)).isoformat()), headers=headers)
    assert future.status_code == 422
    bad_url = client.post("/reports", json=_report(catalog, evidence_url="no es url"), headers=headers)
    assert bad_url.status_code == 422
    ok = client.post("/reports", json=_report(catalog, report_type=2, other_type="ignorado", evidence_url=""), headers=headers)
    assert ok.status_code == 201 and ok.json()["other_type"] is None and ok.json()["evidence_url"] is None


def test_anonymous_reports_hide_identity_from_admins(client, admin, student, catalog):
    application = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": catalog["promotion"]["promotion_id"], "academic_id": student.academic_id}).json()
    internship = client.post(f"/internship-applications/{application['application_id']}/accept", headers=auth(student)).json()
    client.post("/reports", json=_report(catalog, anonymity=True), headers=auth(student))
    client.post("/reports", json=_report(catalog, report_type=3), headers=auth(student))

    listing = client.get("/reports", headers=auth(admin)).json()
    anonymous = next(r for r in listing if r["anonymity"])
    named = next(r for r in listing if not r["anonymity"])
    assert anonymous["academic_id"] is None and anonymous["student"] is None
    # El internado también identificaría al estudiante.
    assert anonymous["internship_id"] is None
    assert named["internship_id"] == internship["internship_id"]
    assert named["academic_id"] == "222000001" and named["student"]["email"] == "alumno@unison.mx"
    assert client.get(f"/reports/{anonymous['report_id']}", headers=auth(admin)).json()["academic_id"] is None

    # Filtrar por expediente no debe revelar los anónimos.
    filtered = client.get("/reports", params={"academic_id": "222000001"}, headers=auth(admin)).json()
    assert [r["report_id"] for r in filtered] == [named["report_id"]]
    by_internship = client.get("/reports", params={"internship_id": internship["internship_id"]}, headers=auth(admin)).json()
    assert [r["report_id"] for r in by_internship] == [named["report_id"]]
    # El propio estudiante sí ve sus datos.
    own = client.get(f"/reports/{anonymous['report_id']}", headers=auth(student)).json()
    assert own["academic_id"] == "222000001"


def test_report_ownership_edit_and_status(client, admin, student, other_student, catalog):
    report = client.post("/reports", json=_report(catalog), headers=auth(student)).json()
    url = f"/reports/{report['report_id']}"
    assert client.get(url, headers=auth(other_student)).status_code == 404
    assert client.get("/reports", headers=auth(other_student)).json() == []
    assert client.patch(url, json={"description": "x"}, headers=auth(other_student)).status_code == 404

    edited = client.patch(url, json={"report_type": 7, "other_type": "Inundación"}, headers=auth(student))
    assert edited.status_code == 200 and edited.json()["other_type"] == "Inundación"
    assert client.patch(url, json={"report_type": 7, "other_type": ""}, headers=auth(student)).status_code == 400

    closed = client.patch(f"{url}/status", json={"is_open": False}, headers=auth(admin))
    assert closed.status_code == 200 and closed.json()["is_open"] is False
    assert client.patch(url, json={"description": "otra"}, headers=auth(student)).status_code == 409
    assert client.delete(url, headers=auth(student)).status_code == 409
    open_only = client.get("/reports", params={"is_open": True}, headers=auth(admin)).json()
    assert open_only == []
    assert client.delete(url, headers=auth(admin)).status_code == 204
