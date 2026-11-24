"""Renuncia y baja del internado y del servicio social: fecha, motivo y efectos."""
from datetime import date, timedelta

from tests.conftest import auth
from tests.test_documents import _requirement, _upload
from tests.test_internships import _accepted_internship
from tests.test_social_service import _accepted_ss, ss_catalog  # noqa: F401 (fixture)

TODAY = date.today().isoformat()
WITHDRAWN, DISMISSED = 4, 5


def _patch(client, admin, internship_id, **body):
    return client.patch(f"/internships/{internship_id}", headers=auth(admin), json=body)


def _in_site(client, admin, student, catalog):
    internship = _accepted_internship(client, admin, student, catalog)
    assigned = _patch(client, admin, internship["internship_id"], site_id=catalog["site_a"]["site_id"])
    assert assigned.status_code == 200, assigned.text
    return internship


def test_withdrawal_needs_date_and_reason(client, admin, student, catalog):
    internship_id = _in_site(client, admin, student, catalog)["internship_id"]
    assert _patch(client, admin, internship_id, status=WITHDRAWN).json()["detail"] == "Indica la fecha de la renuncia."
    no_reason = _patch(client, admin, internship_id, status=WITHDRAWN, exit_date=TODAY, exit_reason="  ")
    assert no_reason.json()["detail"] == "Indica el motivo de la renuncia."
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    assert _patch(client, admin, internship_id, status=WITHDRAWN, exit_date=tomorrow, exit_reason="x").status_code == 422

    withdrawn = _patch(client, admin, internship_id, status=WITHDRAWN, exit_date=TODAY, exit_reason="Formato de renuncia firmado")
    assert withdrawn.status_code == 200, withdrawn.text
    body = withdrawn.json()
    assert (body["status"], body["exit_date"], body["exit_reason"]) == (WITHDRAWN, TODAY, "Formato de renuncia firmado")
    assert body["site_id"] == catalog["site_a"]["site_id"]  # se conserva dónde estaba

    # Cambiar a baja conserva la fecha y el motivo si no se envían otros.
    dismissed = _patch(client, admin, internship_id, status=DISMISSED)
    assert (dismissed.json()["status"], dismissed.json()["exit_reason"]) == (DISMISSED, "Formato de renuncia firmado")

    # En el detalle de la asignación también se ve.
    application = client.get(f"/internship-applications/{body['application_id']}", headers=auth(admin)).json()
    assert application["internship"]["exit_reason"] == "Formato de renuncia firmado"


def test_withdrawal_frees_the_seat_and_allows_a_new_promotion(client, admin, student, other_student, catalog):
    internship_id = _in_site(client, admin, student, catalog)["internship_id"]  # Hospital A tiene cupo 1
    psd = lambda: client.get(f"/promotion-site-details/{catalog['psd']['psd_id']}", headers=auth(admin)).json()  # noqa: E731
    assert psd()["occupied"] == 1
    _patch(client, admin, internship_id, status=WITHDRAWN, exit_date=TODAY, exit_reason="Renuncia")
    assert psd()["occupied"] == 0

    # La plaza vacante la puede tomar otro estudiante.
    other = _accepted_internship(client, admin, other_student, catalog)
    assert _patch(client, admin, other["internship_id"], site_id=catalog["site_a"]["site_id"]).status_code == 200

    # El que renunció vuelve a ser candidato para otra promoción, con su salida a la vista.
    next_promotion = client.post("/promotions", headers=auth(admin), json={"program": 1, "start_date": f"{date.today().year + 1}-01-01"}).json()
    candidates = client.get("/internship-applications/candidates", params={"promotion_id": next_promotion["promotion_id"]},
                            headers=auth(admin)).json()
    mine = next(c for c in candidates if c["academic_id"] == student.academic_id)
    assert mine["previous_exit"] == {"status": WITHDRAWN, "exit_date": TODAY, "promotion_label": catalog["promotion"]["label"]}
    assert other_student.academic_id not in [c["academic_id"] for c in candidates]  # tiene un internado en curso
    again = client.post("/internship-applications", headers=auth(admin),
                        json={"promotion_id": next_promotion["promotion_id"], "academic_id": student.academic_id})
    assert again.status_code == 201, again.text

    # Reactivar el internado anterior ya no procede: su lugar lo ocupa otro interno.
    full = _patch(client, admin, internship_id, status=1)
    assert full.status_code == 409 and "cupo" in full.json()["detail"]


def test_one_internship_in_course_at_a_time(client, admin, student, catalog):
    first = _accepted_internship(client, admin, student, catalog)
    _patch(client, admin, first["internship_id"], status=WITHDRAWN, exit_date=TODAY, exit_reason="Renuncia")
    next_promotion = client.post("/promotions", headers=auth(admin), json={"program": 1, "start_date": f"{date.today().year + 1}-07-01"}).json()
    second = client.post("/internship-applications", headers=auth(admin),
                         json={"promotion_id": next_promotion["promotion_id"], "academic_id": student.academic_id}).json()

    # Si la renuncia se registró por error y se reactiva, no puede aceptar la nueva asignación...
    assert _patch(client, admin, first["internship_id"], status=1).status_code == 200
    blocked = client.post(f"/internship-applications/{second['application_id']}/accept", headers=auth(student))
    assert blocked.status_code == 409 and blocked.json()["detail"] == "Ya tienes un internado en curso en otra promoción."

    # ...y si ya aceptó la nueva, el internado anterior no se puede reactivar.
    _patch(client, admin, first["internship_id"], status=WITHDRAWN, exit_date=TODAY, exit_reason="Renuncia")
    assert client.post(f"/internship-applications/{second['application_id']}/accept", headers=auth(student)).status_code == 200
    again = _patch(client, admin, first["internship_id"], status=1)
    assert again.status_code == 409 and again.json()["detail"].startswith("El estudiante ya tiene otro internado (promoción ")


def test_reactivating_by_mistake(client, admin, student, catalog):
    internship_id = _in_site(client, admin, student, catalog)["internship_id"]
    _patch(client, admin, internship_id, status=DISMISSED, exit_date=TODAY, exit_reason="Faltas injustificadas")
    reactivated = _patch(client, admin, internship_id, status=1)
    assert reactivated.status_code == 200, reactivated.text
    assert (reactivated.json()["exit_date"], reactivated.json()["exit_reason"]) == (None, None)


def test_cannot_exit_a_finished_internship(client, admin, student, catalog):
    internship_id = _in_site(client, admin, student, catalog)["internship_id"]
    assert _patch(client, admin, internship_id, status=3).status_code == 200
    exit_finished = _patch(client, admin, internship_id, status=WITHDRAWN, exit_date=TODAY, exit_reason="x")
    assert exit_finished.status_code == 409


def test_student_documents_close_after_exit(client, admin, student, catalog):
    requirement = _requirement(client, admin, "Bitácora", stage=2)
    internship = _in_site(client, admin, student, catalog)
    assert _upload(client, student, internship["application_id"], requirement["requirement_id"]).status_code == 201
    _patch(client, admin, internship["internship_id"], status=WITHDRAWN, exit_date=TODAY, exit_reason="Renuncia")
    closed = _upload(client, student, internship["application_id"], requirement["requirement_id"])
    assert closed.status_code == 409 and closed.json()["detail"] == "Tu internado terminó por renuncia: ya no se pueden modificar sus documentos."


def test_act_results_skip_records_that_left(client, admin, student, catalog):
    internship = _accepted_internship(client, admin, student, catalog)
    _patch(client, admin, internship["internship_id"], status=WITHDRAWN, exit_date=TODAY, exit_reason="No se presentó")
    results = client.post("/internship-applications/plaza-results", headers=auth(admin), json={"results": [
        {"application_id": internship["application_id"], "site_id": catalog["site_a"]["site_id"]},
    ]}).json()
    assert results == [{"application_id": internship["application_id"], "ok": False,
                        "detail": "Ya no está en curso (finalizó, renunció o causó baja)."}]


def test_social_service_withdrawal(client, admin, student, other_student, ss_catalog):
    service = _accepted_ss(client, admin, student, ss_catalog)
    url = f"/social-services/{service['social_service_id']}"
    site_b = ss_catalog["site_b"]["site_id"]
    assert client.patch(url, headers=auth(admin), json={"site_id": site_b}).status_code == 200
    withdrawn = client.patch(url, headers=auth(admin), json={"status": WITHDRAWN, "exit_date": TODAY, "exit_reason": "Art. 55"})
    assert withdrawn.status_code == 200, withdrawn.text
    psd = client.get(f"/promotion-site-details/{ss_catalog['ss_psd']['psd_id']}", headers=auth(admin)).json()
    assert psd["occupied"] == 0

    # Otro pasante puede tomar la plaza vacante.
    other = _accepted_ss(client, admin, other_student, ss_catalog)
    assert client.patch(f"/social-services/{other['social_service_id']}", headers=auth(admin), json={"site_id": site_b}).status_code == 200
    # Reactivar la renuncia ya no procede: la plaza la ocupa otro pasante.
    assert client.patch(url, headers=auth(admin), json={"status": 1}).status_code == 409


def test_reports_link_only_the_record_in_course(client, admin, student, catalog):
    internship = _in_site(client, admin, student, catalog)
    _patch(client, admin, internship["internship_id"], status=WITHDRAWN, exit_date=TODAY, exit_reason="Renuncia")
    report = client.post("/reports", headers=auth(student), json={
        "site_id": catalog["site_a"]["site_id"], "date_report": TODAY, "report_type": 1, "description": "Incidente",
    })
    assert report.status_code == 201, report.text
    assert report.json()["internship_id"] is None


def test_finished_or_exited_records_cannot_be_deleted(client, admin, student, catalog):
    internship = _in_site(client, admin, student, catalog)
    url = f"/internships/{internship['internship_id']}"
    _patch(client, admin, internship["internship_id"], status=WITHDRAWN, exit_date=TODAY, exit_reason="Renuncia")
    blocked = client.delete(url, headers=auth(admin))
    assert blocked.status_code == 409 and "no se puede eliminar" in blocked.json()["detail"]
    _patch(client, admin, internship["internship_id"], status=1)
    assert client.delete(url, headers=auth(admin)).status_code == 204  # en curso (aceptado por error): sí
