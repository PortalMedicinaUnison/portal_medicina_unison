import pytest

from core.settings import settings
from tests.conftest import PDF_BYTES, auth
from tests.test_social_service import _accredit_internship, _assign_ss, ss_catalog  # noqa: F401 (fixture)

INTERNSHIP, SOCIAL_SERVICE = 1, 2
INSCRIPTION, IN_PROGRESS, COMPLETION = 1, 2, 3
PENDING, APPROVED, REJECTED = 1, 2, 3
BY_STUDENT, BY_COORDINATION = 1, 2
DOCX_BYTES = b"PK\x03\x04" + b"\x00" * 64


def _requirement(client, admin, name, program=INTERNSHIP, stage=INSCRIPTION, **extra):
    response = client.post("/document-requirements", headers=auth(admin), json={
        "program": program, "stage": stage, "name": name, **extra,
    })
    assert response.status_code == 201, response.text
    return response.json()


def _base(program):
    return "/internship-applications" if program == INTERNSHIP else "/social-service-applications"


def _upload(client, user, application_id, requirement_id, program=INTERNSHIP, content=PDF_BYTES, filename="doc.pdf"):
    return client.post(
        f"{_base(program)}/{application_id}/documents", headers=auth(user),
        data={"requirement_id": str(requirement_id)}, files={"file": (filename, content, "application/pdf")},
    )


def _review(client, admin, application_id, document_id, status, comment=None, program=INTERNSHIP):
    return client.patch(
        f"{_base(program)}/{application_id}/documents/{document_id}/review", headers=auth(admin),
        json={"review_status": status, "review_comment": comment},
    )


def _assign(client, admin, catalog, student):
    response = client.post("/internship-applications", headers=auth(admin), json={
        "promotion_id": catalog["promotion"]["promotion_id"], "academic_id": student.academic_id,
    })
    assert response.status_code == 201, response.text
    return response.json()


def _accept(client, student, application):
    response = client.post(f"/internship-applications/{application['application_id']}/accept", headers=auth(student))
    assert response.status_code == 200, response.text
    return response.json()


# ---------------------- CATÁLOGO ----------------------

def test_catalog_crud_and_retire(client, admin, student):
    created = _requirement(client, admin, "  Certificado médico ", validity_months=3, description="De institución pública.")
    assert created["name"] == "Certificado médico" and created["validity_months"] == 3
    assert created["is_required"] is True and created["allows_multiple"] is False and created["has_template"] is False

    listed = client.get("/document-requirements", params={"program": INTERNSHIP}, headers=auth(student)).json()
    assert [r["name"] for r in listed] == ["Certificado médico"]
    assert client.get("/document-requirements", params={"program": SOCIAL_SERVICE}, headers=auth(student)).json() == []

    blank = client.post("/document-requirements", headers=auth(admin), json={"program": 1, "stage": 1, "name": "  "})
    assert blank.status_code == 422 and blank.json()["detail"] == "Nombre: no puede estar vacío."
    assert client.post("/document-requirements", headers=auth(admin),
                       json={"program": 1, "stage": 1, "name": "X", "validity_months": 0}).status_code == 422
    assert client.post("/document-requirements", headers=auth(admin),
                       json={"program": 3, "stage": 1, "name": "X"}).status_code == 422

    url = f"/document-requirements/{created['requirement_id']}"
    updated = client.patch(url, headers=auth(admin), json={"is_required": False, "validity_months": None, "program": 2})
    assert updated.status_code == 200
    assert updated.json()["is_required"] is False and updated.json()["validity_months"] is None
    assert updated.json()["program"] == INTERNSHIP  # el programa no se cambia

    assert client.delete(url, headers=auth(admin)).status_code == 204
    assert client.get("/document-requirements", headers=auth(admin)).json() == []
    retired = client.get("/document-requirements", params={"include_inactive": True}, headers=auth(admin)).json()
    assert [r["is_active"] for r in retired] == [False]
    assert client.get("/document-requirements", params={"include_inactive": True}, headers=auth(student)).json() == []
    assert client.get(url, headers=auth(admin)).status_code == 404


def test_requirement_templates(client, admin, student):
    requirement = _requirement(client, admin, "Ficha de inscripción")
    url = f"/document-requirements/{requirement['requirement_id']}/template"

    pdf = client.put(url, headers=auth(admin), files={"file": ("ficha.pdf", PDF_BYTES, "application/pdf")})
    assert pdf.status_code == 200, pdf.text
    assert pdf.json()["has_template"] is True and pdf.json()["template_filename"] == "ficha.pdf"
    downloaded = client.get(url, headers=auth(student))
    assert downloaded.status_code == 200 and downloaded.content == PDF_BYTES
    assert downloaded.headers["content-type"] == "application/pdf"
    assert 'filename="ficha.pdf"' in downloaded.headers["content-disposition"]

    docx = client.put(url, headers=auth(admin), files={"file": ("../Ficha 2027.docx", DOCX_BYTES, "application/octet-stream")})
    assert docx.status_code == 200 and docx.json()["template_filename"] == "Ficha 2027.docx"
    assert client.get(url, headers=auth(student)).headers["content-type"].startswith(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    # El PDF anterior se borra del disco al reemplazarlo.
    assert len(list((settings.UPLOAD_DIR / "document-templates").glob("*.pdf"))) == 0

    exe = client.put(url, headers=auth(admin), files={"file": ("ficha.exe", b"MZ" + b"\x00" * 20, "application/octet-stream")})
    assert exe.status_code == 400 and "PDF, Word" in exe.json()["detail"]
    fake = client.put(url, headers=auth(admin), files={"file": ("ficha.docx", PDF_BYTES, "application/octet-stream")})
    assert fake.status_code == 400 and "no corresponde" in fake.json()["detail"]

    removed = client.delete(url, headers=auth(admin))
    assert removed.status_code == 200 and removed.json()["has_template"] is False
    assert client.get(url, headers=auth(student)).status_code == 404


# ---------------------- EXPEDIENTE ----------------------

def test_student_builds_inscription_expediente(client, admin, student, other_student, catalog):
    ficha = _requirement(client, admin, "Ficha", sort_order=1)
    _requirement(client, admin, "Dictamen psicológico", is_required=False, sort_order=2)
    bitacora = _requirement(client, admin, "Bitácora", stage=IN_PROGRESS, allows_multiple=True)
    other_program = _requirement(client, admin, "Ficha SS", program=SOCIAL_SERVICE)
    application = _assign(client, admin, catalog, student)
    app_id = application["application_id"]
    base = f"/internship-applications/{app_id}"

    first = _upload(client, student, app_id, ficha["requirement_id"], filename="../ficha.pdf")
    assert first.status_code == 201, first.text
    document = first.json()
    assert document["review_status"] == PENDING and document["application_id"] == app_id
    assert document["requirement"]["name"] == "Ficha" and document["original_filename"] == "ficha.pdf"
    assert document["uploaded_by_coordination"] is False

    early = _upload(client, student, app_id, bitacora["requirement_id"])
    assert early.status_code == 409 and "cuando aceptes" in early.json()["detail"]
    assert _upload(client, student, app_id, other_program["requirement_id"]).status_code == 400
    assert _upload(client, student, app_id, ficha["requirement_id"], content=b"GIF89a").status_code == 400
    assert _upload(client, student, app_id, 9999).status_code == 400

    # Otro estudiante no ve ni toca el expediente.
    assert client.get(f"{base}/documents", headers=auth(other_student)).status_code == 404
    assert _upload(client, other_student, app_id, ficha["requirement_id"]).status_code == 404
    file_url = f"{base}/documents/{document['document_id']}/file"
    assert client.get(file_url, headers=auth(other_student)).status_code == 404
    viewed = client.get(file_url, headers=auth(student))
    assert viewed.status_code == 200 and viewed.content == PDF_BYTES and viewed.headers["content-disposition"].startswith("inline")
    assert client.get(file_url, params={"download": True}, headers=auth(admin)).headers["content-disposition"].startswith("attachment")

    progress = client.get(base, headers=auth(student)).json()["inscription_progress"]
    assert progress == {"required": 1, "submitted": 1, "approved": 0, "all_submitted": True, "complete": False}

    # Un requisito de un solo archivo: el nuevo reemplaza al anterior.
    replacement = _upload(client, student, app_id, ficha["requirement_id"], filename="ficha-v2.pdf").json()
    names = [d["original_filename"] for d in client.get(f"{base}/documents", headers=auth(student)).json()]
    assert names == ["ficha-v2.pdf"]

    approved = _review(client, admin, app_id, replacement["document_id"], APPROVED)
    assert approved.status_code == 200 and approved.json()["review_status"] == APPROVED
    assert approved.json()["reviewed_at"] is not None
    locked = _upload(client, student, app_id, ficha["requirement_id"])
    assert locked.status_code == 409 and "ya fue aprobado" in locked.json()["detail"]
    assert client.delete(f"{base}/documents/{replacement['document_id']}", headers=auth(student)).status_code == 409

    assert client.get(base, headers=auth(student)).json()["inscription_progress"]["complete"] is True
    listed = client.get("/internship-applications", headers=auth(admin)).json()
    assert listed[0]["inscription_progress"] == {
        "required": 1, "submitted": 1, "approved": 1, "all_submitted": True, "complete": True,
    }


def test_review_with_observations_and_resubmission(client, admin, student, catalog):
    curp = _requirement(client, admin, "CURP")
    app_id = _assign(client, admin, catalog, student)["application_id"]
    document = _upload(client, student, app_id, curp["requirement_id"]).json()

    no_comment = _review(client, admin, app_id, document["document_id"], REJECTED)
    assert no_comment.status_code == 422 and no_comment.json()["detail"] == "Escribe las observaciones para el estudiante."
    rejected = _review(client, admin, app_id, document["document_id"], REJECTED, "  La CURP no es legible. ")
    assert rejected.json()["review_status"] == REJECTED and rejected.json()["review_comment"] == "La CURP no es legible."

    seen = client.get(f"/internship-applications/{app_id}/documents", headers=auth(student)).json()
    assert seen[0]["review_comment"] == "La CURP no es legible."
    resubmitted = _upload(client, student, app_id, curp["requirement_id"]).json()
    assert resubmitted["review_status"] == PENDING and resubmitted["review_comment"] is None

    approved = _review(client, admin, app_id, resubmitted["document_id"], APPROVED).json()
    back = _review(client, admin, app_id, approved["document_id"], PENDING).json()
    assert back["review_status"] == PENDING and back["reviewed_at"] is None
    # De nuevo en revisión, el estudiante puede reemplazarlo.
    assert _upload(client, student, app_id, curp["requirement_id"]).status_code == 201


def test_multiple_files_and_deletion_after_accepting(client, admin, student, catalog):
    bitacora = _requirement(client, admin, "Bitácora", stage=IN_PROGRESS, allows_multiple=True)
    application = _assign(client, admin, catalog, student)
    _accept(client, student, application)
    app_id = application["application_id"]

    first = _upload(client, student, app_id, bitacora["requirement_id"], filename="cirugia.pdf").json()
    _upload(client, student, app_id, bitacora["requirement_id"], filename="pediatria.pdf")
    listed = client.get(f"/internship-applications/{app_id}/documents", headers=auth(student)).json()
    assert [d["original_filename"] for d in listed] == ["cirugia.pdf", "pediatria.pdf"]

    assert client.delete(f"/internship-applications/{app_id}/documents/{first['document_id']}", headers=auth(student)).status_code == 204
    remaining = client.get(f"/internship-applications/{app_id}/documents", headers=auth(admin)).json()
    assert [d["original_filename"] for d in remaining] == ["pediatria.pdf"]


def test_each_document_is_uploaded_by_student_or_coordination(client, admin, student, catalog):
    ficha = _requirement(client, admin, "Ficha")
    constancia = _requirement(client, admin, "Constancia de culminación", stage=COMPLETION, provided_by=BY_COORDINATION)
    assert constancia["provided_by"] == BY_COORDINATION and ficha["provided_by"] == BY_STUDENT
    application = _assign(client, admin, catalog, student)
    app_id = application["application_id"]
    base = f"/internship-applications/{app_id}/documents"

    # La coordinación no sube documentos del alumno: solo los revisa.
    by_admin = _upload(client, admin, app_id, ficha["requirement_id"])
    assert by_admin.status_code == 403 and "lo sube el alumno" in by_admin.json()["detail"]
    ficha_doc = _upload(client, student, app_id, ficha["requirement_id"]).json()
    assert client.delete(f"{base}/{ficha_doc['document_id']}", headers=auth(admin)).status_code == 403

    # Antes de aceptar, ni la coordinación sube documentos de término.
    assert _upload(client, admin, app_id, constancia["requirement_id"]).status_code == 409
    _accept(client, student, application)

    # Los de la coordinación los sube solo ella y quedan aprobados.
    by_student = _upload(client, student, app_id, constancia["requirement_id"])
    assert by_student.status_code == 403 and "lo sube la coordinación" in by_student.json()["detail"]
    uploaded = _upload(client, admin, app_id, constancia["requirement_id"])
    assert uploaded.status_code == 201, uploaded.text
    document = uploaded.json()
    assert document["review_status"] == APPROVED and document["reviewed_at"] is not None
    assert document["uploaded_by_coordination"] is True
    assert _review(client, admin, app_id, document["document_id"], PENDING).status_code == 409

    file_url = f"{base}/{document['document_id']}/file"
    assert client.get(file_url, headers=auth(student)).status_code == 200
    assert client.delete(f"{base}/{document['document_id']}", headers=auth(student)).status_code == 403
    assert client.delete(f"{base}/{document['document_id']}", headers=auth(admin)).status_code == 204


def test_declined_assignment_closes_student_documents(client, admin, student, catalog):
    ficha = _requirement(client, admin, "Ficha")
    app_id = _assign(client, admin, catalog, student)["application_id"]
    assert client.post(f"/internship-applications/{app_id}/decline", headers=auth(student)).status_code == 200
    closed = _upload(client, student, app_id, ficha["requirement_id"])
    assert closed.status_code == 409 and "Declinaste" in closed.json()["detail"]


def test_accepting_requires_the_inscription_documents(client, admin, student, catalog):
    ficha = _requirement(client, admin, "Ficha de inscripción")
    curp = _requirement(client, admin, "CURP")
    _requirement(client, admin, "Dictamen", is_required=False)
    application = _assign(client, admin, catalog, student)
    app_id = application["application_id"]
    accept_url = f"/internship-applications/{app_id}/accept"

    blocked = client.post(accept_url, headers=auth(student))
    assert blocked.status_code == 409
    assert "Antes de aceptar" in blocked.json()["detail"]
    assert "Ficha de inscripción" in blocked.json()["detail"] and "CURP" in blocked.json()["detail"]
    assert "Dictamen" not in blocked.json()["detail"]

    _upload(client, student, app_id, ficha["requirement_id"])
    curp_doc = _upload(client, student, app_id, curp["requirement_id"]).json()
    # Uno con observaciones no cuenta: hay que corregirlo.
    _review(client, admin, app_id, curp_doc["document_id"], REJECTED, "Ilegible")
    progress = client.get(f"/internship-applications/{app_id}", headers=auth(student)).json()["inscription_progress"]
    assert progress["submitted"] == 1 and progress["all_submitted"] is False
    again = client.post(accept_url, headers=auth(student))
    assert again.status_code == 409 and "CURP" in again.json()["detail"] and "Ficha" not in again.json()["detail"]

    _upload(client, student, app_id, curp["requirement_id"])
    assert client.post(accept_url, headers=auth(student)).status_code == 200


def test_retired_requirement_keeps_uploaded_files(client, admin, student, catalog):
    ficha = _requirement(client, admin, "Ficha 2026")
    app_id = _assign(client, admin, catalog, student)["application_id"]
    _upload(client, student, app_id, ficha["requirement_id"])
    assert client.delete(f"/document-requirements/{ficha['requirement_id']}", headers=auth(admin)).status_code == 204

    documents = client.get(f"/internship-applications/{app_id}/documents", headers=auth(student)).json()
    assert [(d["requirement"]["name"], d["requirement"]["is_active"]) for d in documents] == [("Ficha 2026", False)]
    assert _upload(client, student, app_id, ficha["requirement_id"]).status_code == 400
    # Ya no cuenta para el avance de inscripción.
    progress = client.get(f"/internship-applications/{app_id}", headers=auth(student)).json()["inscription_progress"]
    assert progress == {"required": 0, "submitted": 0, "approved": 0, "all_submitted": True, "complete": True}


# ---------------------- REGLAS AL AVANZAR ----------------------

def test_site_requires_complete_inscription_and_finish_requires_completion(client, admin, student, catalog):
    ficha = _requirement(client, admin, "Ficha de inscripción")
    _requirement(client, admin, "Dictamen", is_required=False)
    bitacora = _requirement(client, admin, "Bitácora", stage=IN_PROGRESS, allows_multiple=True)
    constancia = _requirement(client, admin, "Constancia de culminación", stage=COMPLETION, provided_by=BY_COORDINATION)
    application = _assign(client, admin, catalog, student)
    app_id = application["application_id"]
    ficha_doc = _upload(client, student, app_id, ficha["requirement_id"]).json()
    internship = _accept(client, student, application)
    url = f"/internships/{internship['internship_id']}"
    site = {"site_id": catalog["site_a"]["site_id"]}

    # Subido pero aún en revisión: no basta para registrar la sede.
    blocked = client.patch(url, headers=auth(admin), json=site)
    assert blocked.status_code == 409
    assert "documentos obligatorios de inscripción" in blocked.json()["detail"] and "Ficha de inscripción" in blocked.json()["detail"]
    assert "Dictamen" not in blocked.json()["detail"]

    _review(client, admin, app_id, ficha_doc["document_id"], APPROVED)
    assert client.patch(url, headers=auth(admin), json=site).status_code == 200

    not_yet = client.patch(url, headers=auth(admin), json={"status": 3})
    assert not_yet.status_code == 409
    assert "Bitácora" in not_yet.json()["detail"] and "Constancia de culminación" in not_yet.json()["detail"]
    bitacora_doc = _upload(client, student, app_id, bitacora["requirement_id"]).json()
    _review(client, admin, app_id, bitacora_doc["document_id"], APPROVED)
    assert _upload(client, admin, app_id, constancia["requirement_id"]).status_code == 201  # queda aprobada
    assert client.patch(url, headers=auth(admin), json={"status": 3}).status_code == 200

    # Internado finalizado: el expediente queda cerrado para el estudiante.
    closed = _upload(client, student, app_id, ficha["requirement_id"])
    assert closed.status_code == 409


def test_social_service_expediente_and_release(client, admin, student, ss_catalog):  # noqa: F811
    ficha = _requirement(client, admin, "Ficha de inscripción al servicio social", program=SOCIAL_SERVICE)
    reportes = _requirement(
        client, admin, "Reportes trimestrales", program=SOCIAL_SERVICE, stage=COMPLETION, allows_multiple=True,
        description="Sube el acuse de cada reporte trimestral.",
    )
    _accredit_internship(client, admin, student, ss_catalog)
    application = _assign_ss(client, admin, ss_catalog, student.academic_id).json()
    app_id = application["application_id"]

    ficha_doc = _upload(client, student, app_id, ficha["requirement_id"], program=SOCIAL_SERVICE)
    assert ficha_doc.status_code == 201, ficha_doc.text
    # Un requisito de internado no sirve para el expediente de servicio social.
    internship_req = _requirement(client, admin, "Solo internado")
    assert _upload(client, student, app_id, internship_req["requirement_id"], program=SOCIAL_SERVICE).status_code == 400

    service = client.post(f"/social-service-applications/{app_id}/accept", headers=auth(student)).json()
    url = f"/social-services/{service['social_service_id']}"
    plaza = {"site_id": ss_catalog["site_b"]["site_id"]}
    assert client.patch(url, headers=auth(admin), json=plaza).status_code == 409
    _review(client, admin, app_id, ficha_doc.json()["document_id"], APPROVED, program=SOCIAL_SERVICE)
    assert client.patch(url, headers=auth(admin), json=plaza).status_code == 200

    blocked = client.patch(url, headers=auth(admin), json={"status": 3})
    assert blocked.status_code == 409 and "Reportes trimestrales" in blocked.json()["detail"]
    for quarter in range(1, 5):
        acuse = _upload(client, student, app_id, reportes["requirement_id"], program=SOCIAL_SERVICE, filename=f"acuse-{quarter}.pdf")
        assert acuse.status_code == 201
    first = client.get(f"/social-service-applications/{app_id}/documents", headers=auth(admin)).json()
    acuse = next(d for d in first if d["requirement_id"] == reportes["requirement_id"])
    _review(client, admin, app_id, acuse["document_id"], APPROVED, program=SOCIAL_SERVICE)
    released = client.patch(url, headers=auth(admin), json={"status": 3})
    assert released.status_code == 200, released.text

    closed = _upload(client, student, app_id, reportes["requirement_id"], program=SOCIAL_SERVICE)
    assert closed.status_code == 409 and "liberado" in closed.json()["detail"]


@pytest.mark.parametrize("program", [INTERNSHIP, SOCIAL_SERVICE])
def test_expediente_of_unknown_application(client, admin, program):
    assert client.get(f"{_base(program)}/9999/documents", headers=auth(admin)).status_code == 404
