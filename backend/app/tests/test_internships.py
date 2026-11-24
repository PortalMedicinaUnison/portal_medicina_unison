from tests.conftest import PDF_BYTES, auth


def _assign(client, admin, catalog, academic_id="222000001"):
    response = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": catalog["promotion"]["promotion_id"], "academic_id": academic_id,
    })
    assert response.status_code == 201, response.text
    return response.json()


def _accepted_internship(client, admin, student, catalog):
    application = _assign(client, admin, catalog, student.academic_id)
    response = client.post(f"/internship-applications/{application['application_id']}/accept", headers=auth(student))
    assert response.status_code == 200, response.text
    return response.json()


def test_application_requires_registered_student(client, admin, catalog):
    response = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": catalog["promotion"]["promotion_id"], "academic_id": "222999999"})
    assert response.status_code == 400


def test_application_lifecycle(client, admin, student, other_student, catalog):
    application = _assign(client, admin, catalog)
    assert application["status"] == 1 and application["student"]["email"] == "alumno@unison.mx"
    assert application["promotion"]["year"] == catalog["promotion"]["year"]
    assert _assign_dup(client, admin, catalog).status_code == 409

    # El estudiante solo ve las suyas; otro estudiante no puede verla ni responderla.
    mine = client.get("/internship-applications", params={"status": 1}, headers=auth(student)).json()
    assert [a["application_id"] for a in mine] == [application["application_id"]]
    assert client.get("/internship-applications", headers=auth(other_student)).json() == []
    url = f"/internship-applications/{application['application_id']}"
    assert client.get(url, headers=auth(other_student)).status_code == 404
    assert client.post(f"{url}/accept", headers=auth(other_student)).status_code == 404

    internship = client.post(f"{url}/accept", headers=auth(student))
    assert internship.status_code == 200, internship.text
    body = internship.json()
    assert body["status"] == 1 and body["site_id"] is None and body["academic_id"] == "222000001"
    assert body["application"]["status"] == 2
    assert client.post(f"{url}/accept", headers=auth(student)).status_code == 409
    assert client.post(f"{url}/decline", headers=auth(student)).status_code == 409
    assert client.get(url, headers=auth(student)).json()["internship_id"] == body["internship_id"]


def _assign_dup(client, admin, catalog):
    return client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": catalog["promotion"]["promotion_id"], "academic_id": "222000001"})


def test_decline(client, admin, student, catalog):
    application = _assign(client, admin, catalog)
    response = client.post(f"/internship-applications/{application['application_id']}/decline", headers=auth(student))
    assert response.status_code == 200 and response.json()["status"] == 3
    assert client.get("/internships", headers=auth(student)).json() == []


def test_site_assignment_respects_capacity(client, admin, student, other_student, catalog):
    first = _accepted_internship(client, admin, student, catalog)
    second = _accepted_internship(client, admin, other_student, catalog)
    headers = auth(admin)
    site_a, site_b = catalog["site_a"]["site_id"], catalog["site_b"]["site_id"]

    assigned = client.patch(f"/internships/{first['internship_id']}", json={"site_id": site_a}, headers=headers)
    assert assigned.status_code == 200 and assigned.json()["site"]["name"] == "Hospital A"
    full = client.patch(f"/internships/{second['internship_id']}", json={"site_id": site_a}, headers=headers)
    assert full.status_code == 409 and "cupo" in full.json()["detail"]
    no_psd = client.patch(f"/internships/{second['internship_id']}", json={"site_id": site_b}, headers=headers)
    assert no_psd.status_code == 400

    psd = client.get("/promotion-site-details", headers=headers).json()[0]
    assert psd["occupied"] == 1
    assert client.patch(f"/promotion-site-details/{psd['psd_id']}", json={"capacity": 0}, headers=headers).status_code == 422
    assert client.delete(f"/promotion-site-details/{psd['psd_id']}", headers=headers).status_code == 409

    # Al finalizar el primer internado se libera el cupo.
    client.patch(f"/internships/{first['internship_id']}", json={"status": 3}, headers=headers)
    assert client.patch(f"/internships/{second['internship_id']}", json={"site_id": site_a}, headers=headers).status_code == 200

    by_site = client.get("/internships", params={"site_id": site_a}, headers=headers).json()
    assert {i["internship_id"] for i in by_site} == {first["internship_id"], second["internship_id"]}
    mine = client.get("/internships", headers=auth(student)).json()
    assert [i["internship_id"] for i in mine] == [first["internship_id"]]


def test_deleting_internship_reopens_application(client, admin, student, catalog):
    internship = _accepted_internship(client, admin, student, catalog)
    assert client.delete(f"/internships/{internship['internship_id']}", headers=auth(admin)).status_code == 204
    application_id = internship["application_id"]
    application = client.get(f"/internship-applications/{application_id}", headers=auth(student)).json()
    assert application["status"] == 1 and application["internship_id"] is None
    again = client.post(f"/internship-applications/{application_id}/accept", headers=auth(student))
    assert again.status_code == 200 and again.json()["internship_id"] == internship["internship_id"]


def test_cannot_assign_student_with_internship_in_progress(client, admin, student, catalog):
    _accepted_internship(client, admin, student, catalog)
    headers = auth(admin)
    other = client.post("/promotions", json={"year": catalog["promotion"]["year"], "period": 2}, headers=headers).json()
    response = client.post("/internship-applications", headers=headers, json={
        "promotion_id": other["promotion_id"], "academic_id": student.academic_id})
    assert response.status_code == 409


def test_documents(client, admin, student, other_student, catalog):
    internship = _accepted_internship(client, admin, student, catalog)
    base = f"/internships/{internship['internship_id']}/documents"
    headers = auth(student)

    not_pdf = client.post(base, headers=headers, data={"document_type": "1"},
                          files={"file": ("foto.pdf", b"GIF89a....", "application/pdf")})
    assert not_pdf.status_code == 400
    too_big = client.post(base, headers=headers, data={"document_type": "1"},
                          files={"file": ("big.pdf", PDF_BYTES + b"0" * (1024 * 1024 + 1), "application/pdf")})
    assert too_big.status_code == 413

    uploaded = client.post(base, headers=headers, data={"document_type": "3"},
                           files={"file": ("../../kardex.pdf", PDF_BYTES, "text/html")})
    assert uploaded.status_code == 201, uploaded.text
    document = uploaded.json()
    assert document["media_type"] == "application/pdf" and document["original_filename"] == "kardex.pdf"
    duplicate = client.post(base, headers=headers, data={"document_type": "3"},
                            files={"file": ("k2.pdf", PDF_BYTES, "application/pdf")})
    assert duplicate.status_code == 409

    file_url = f"{base}/{document['document_id']}/file"
    viewed = client.get(file_url, headers=headers)
    assert viewed.status_code == 200 and viewed.content == PDF_BYTES
    assert viewed.headers["content-type"] == "application/pdf"
    assert viewed.headers["content-disposition"].startswith("inline")
    downloaded = client.get(file_url, params={"download": True}, headers=auth(admin))
    assert downloaded.headers["content-disposition"].startswith("attachment")

    assert client.get(base, headers=auth(other_student)).status_code == 404
    assert client.get(file_url, headers=auth(other_student)).status_code == 404

    assert client.delete(f"{base}/{document['document_id']}", headers=headers).status_code == 204
    assert client.get(base, headers=headers).json() == []
    replaced = client.post(base, headers=headers, data={"document_type": "3"},
                           files={"file": ("k2.pdf", PDF_BYTES, "application/pdf")})
    assert replaced.status_code == 201
