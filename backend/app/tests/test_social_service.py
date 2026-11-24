from datetime import date, timedelta

import pytest

from tests.conftest import PDF_BYTES, auth


@pytest.fixture()
def ss_catalog(client, admin, catalog):
    """Promoción de servicio social del año en curso con 1 plaza en la sede B."""
    headers = auth(admin)
    promotion = client.post("/promotions", headers=headers, json={
        "program": 2, "year": catalog["promotion"]["year"], "period": 1,
    })
    assert promotion.status_code == 201, promotion.text
    promotion = promotion.json()
    psd = client.post("/promotion-site-details", headers=headers, json={
        "promotion_id": promotion["promotion_id"], "site_id": catalog["site_b"]["site_id"], "capacity": 1,
    }).json()
    return {**catalog, "ss_promotion": promotion, "ss_psd": psd}


def _accredit_internship(client, admin, student, catalog):
    """El estudiante acepta su internado y la coordinación lo finaliza (acredita)."""
    application = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": catalog["promotion"]["promotion_id"], "academic_id": student.academic_id}).json()
    internship = client.post(f"/internship-applications/{application['application_id']}/accept", headers=auth(student)).json()
    finished = client.patch(f"/internships/{internship['internship_id']}", json={"status": 3}, headers=auth(admin))
    assert finished.status_code == 200, finished.text
    return internship


def _assign_ss(client, admin, ss_catalog, academic_id):
    return client.post("/social-service-applications", headers=auth(admin), json={
        "promotion_id": ss_catalog["ss_promotion"]["promotion_id"], "academic_id": academic_id})


def _accepted_ss(client, admin, student, ss_catalog):
    _accredit_internship(client, admin, student, ss_catalog)
    application = _assign_ss(client, admin, ss_catalog, student.academic_id)
    assert application.status_code == 201, application.text
    service = client.post(f"/social-service-applications/{application.json()['application_id']}/accept", headers=auth(student))
    assert service.status_code == 200, service.text
    return service.json()


def test_promotions_are_separated_by_program(client, admin, ss_catalog):
    headers = auth(admin)
    assert ss_catalog["ss_promotion"]["program"] == 2 and ss_catalog["promotion"]["program"] == 1
    # El mismo año y periodo puede existir una vez por programa.
    duplicate = client.post("/promotions", headers=headers, json={"program": 2, "year": ss_catalog["ss_promotion"]["year"], "period": 1})
    assert duplicate.status_code == 409
    only_ss = client.get("/promotions", params={"program": 2}, headers=headers).json()
    assert [p["promotion_id"] for p in only_ss] == [ss_catalog["ss_promotion"]["promotion_id"]]


def test_programs_do_not_mix(client, admin, student, ss_catalog):
    headers = auth(admin)
    internship_in_ss = client.post("/internship-applications", headers=headers, json={
        "promotion_id": ss_catalog["ss_promotion"]["promotion_id"], "academic_id": student.academic_id})
    assert internship_in_ss.status_code == 400
    ss_in_internship = client.post("/social-service-applications", headers=headers, json={
        "promotion_id": ss_catalog["promotion"]["promotion_id"], "academic_id": student.academic_id})
    assert ss_in_internship.status_code == 400


def test_social_service_requires_accredited_internship(client, admin, student, ss_catalog):
    response = _assign_ss(client, admin, ss_catalog, student.academic_id)
    assert response.status_code == 409 and "acreditar el internado" in response.json()["detail"]

    # Con el internado en curso (no finalizado) tampoco.
    application = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": ss_catalog["promotion"]["promotion_id"], "academic_id": student.academic_id}).json()
    internship = client.post(f"/internship-applications/{application['application_id']}/accept", headers=auth(student)).json()
    assert _assign_ss(client, admin, ss_catalog, student.academic_id).status_code == 409

    client.patch(f"/internships/{internship['internship_id']}", json={"status": 3}, headers=auth(admin))
    assigned = _assign_ss(client, admin, ss_catalog, student.academic_id)
    assert assigned.status_code == 201, assigned.text
    assert assigned.json()["status"] == 1 and assigned.json()["promotion"]["program"] == 2
    assert _assign_ss(client, admin, ss_catalog, student.academic_id).status_code == 409


def test_social_service_lifecycle(client, admin, student, other_student, ss_catalog):
    service = _accepted_ss(client, admin, student, ss_catalog)
    assert service["status"] == 1 and service["site_id"] is None and service["academic_id"] == student.academic_id
    application_id = service["application_id"]
    url = f"/social-service-applications/{application_id}"
    assert client.post(f"{url}/accept", headers=auth(student)).status_code == 409
    assert client.get(url, headers=auth(student)).json()["social_service_id"] == service["social_service_id"]

    # El estudiante solo ve lo suyo.
    assert [s["social_service_id"] for s in client.get("/social-services", headers=auth(student)).json()] == [service["social_service_id"]]
    assert client.get("/social-services", headers=auth(other_student)).json() == []
    assert client.get(f"/social-services/{service['social_service_id']}", headers=auth(other_student)).status_code == 404

    # Dar de baja el servicio regresa la asignación a pendiente y se puede volver a aceptar.
    assert client.delete(f"/social-services/{service['social_service_id']}", headers=auth(admin)).status_code == 204
    assert client.get(url, headers=auth(student)).json()["status"] == 1
    again = client.post(f"{url}/accept", headers=auth(student))
    assert again.status_code == 200 and again.json()["social_service_id"] == service["social_service_id"]


def test_decline_social_service(client, admin, student, ss_catalog):
    _accredit_internship(client, admin, student, ss_catalog)
    application = _assign_ss(client, admin, ss_catalog, student.academic_id).json()
    declined = client.post(f"/social-service-applications/{application['application_id']}/decline", headers=auth(student))
    assert declined.status_code == 200 and declined.json()["status"] == 3
    assert client.get("/social-services", headers=auth(student)).json() == []


def test_plaza_assignment_uses_social_service_capacity(client, admin, student, other_student, ss_catalog):
    first = _accepted_ss(client, admin, student, ss_catalog)
    second = _accepted_ss(client, admin, other_student, ss_catalog)
    headers = auth(admin)
    site_a, site_b = ss_catalog["site_a"]["site_id"], ss_catalog["site_b"]["site_id"]

    # La sede A tiene cupo solo en la promoción de internado, no en la de servicio social.
    assert client.patch(f"/social-services/{first['social_service_id']}", json={"site_id": site_a}, headers=headers).status_code == 400
    assigned = client.patch(f"/social-services/{first['social_service_id']}", json={"site_id": site_b}, headers=headers)
    assert assigned.status_code == 200 and assigned.json()["site"]["name"] == "Hospital B"
    full = client.patch(f"/social-services/{second['social_service_id']}", json={"site_id": site_b}, headers=headers)
    assert full.status_code == 409 and "plazas" in full.json()["detail"]

    # Los cupos de cada promoción cuentan solo su propio programa.
    ss_psd = client.get("/promotion-site-details", params={"promotion_id": ss_catalog["ss_promotion"]["promotion_id"]}, headers=headers).json()[0]
    assert ss_psd["occupied"] == 1
    internship_psd = client.get("/promotion-site-details", params={"promotion_id": ss_catalog["promotion"]["promotion_id"]}, headers=headers).json()[0]
    assert internship_psd["occupied"] == 0  # los internados ya se finalizaron
    assert client.delete(f"/promotion-site-details/{ss_psd['psd_id']}", headers=headers).status_code == 409

    # Al liberar el primer servicio se libera la plaza.
    released = client.patch(f"/social-services/{first['social_service_id']}", json={"status": 3}, headers=headers)
    assert released.status_code == 200 and released.json()["status"] == 3
    assert client.patch(f"/social-services/{second['social_service_id']}", json={"site_id": site_b}, headers=headers).status_code == 200


def test_social_service_documents(client, admin, student, other_student, ss_catalog):
    service = _accepted_ss(client, admin, student, ss_catalog)
    base = f"/social-services/{service['social_service_id']}/documents"
    headers = auth(student)
    uploaded = client.post(base, headers=headers, data={"document_type": "1"},
                           files={"file": ("asignacion.pdf", PDF_BYTES, "application/pdf")})
    assert uploaded.status_code == 201, uploaded.text
    document = uploaded.json()
    assert document["document_type"] == 1 and document["original_filename"] == "asignacion.pdf"
    assert client.post(base, headers=headers, data={"document_type": "1"},
                       files={"file": ("otra.pdf", PDF_BYTES, "application/pdf")}).status_code == 409
    assert client.post(base, headers=headers, data={"document_type": "2"},
                       files={"file": ("x.pdf", b"no es pdf", "application/pdf")}).status_code == 400

    file_url = f"{base}/{document['document_id']}/file"
    assert client.get(file_url, headers=headers).content == PDF_BYTES
    assert client.get(file_url, headers=auth(admin)).status_code == 200
    assert client.get(base, headers=auth(other_student)).status_code == 404
    assert client.delete(f"{base}/{document['document_id']}", headers=headers).status_code == 204
    assert client.get(base, headers=headers).json() == []


def test_report_during_social_service_is_linked_and_masked(client, admin, student, ss_catalog):
    service = _accepted_ss(client, admin, student, ss_catalog)
    report = {
        "site_id": ss_catalog["site_b"]["site_id"], "date_report": (date.today() - timedelta(days=1)).isoformat(),
        "report_type": 2, "description": "Inseguridad en la comunidad.",
    }
    named = client.post("/reports", json=report, headers=auth(student)).json()
    assert named["social_service_id"] == service["social_service_id"]
    assert named["internship_id"] is None  # el internado ya está acreditado
    anonymous = client.post("/reports", json={**report, "anonymity": True}, headers=auth(student)).json()
    as_admin = client.get(f"/reports/{anonymous['report_id']}", headers=auth(admin)).json()
    assert as_admin["social_service_id"] is None and as_admin["academic_id"] is None
