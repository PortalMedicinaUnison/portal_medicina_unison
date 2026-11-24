from datetime import date

from tests.conftest import auth
from tests.test_internships import _accepted_internship

YEAR = date.today().year


def _post(client, admin, **body):
    return client.post("/promotions", headers=auth(admin), json=body)


def _seats(client, admin, promotion_id, rows):
    return client.patch(f"/promotions/{promotion_id}/seats", headers=auth(admin), json={"seats": rows})


def _capacities(client, admin, promotion_id):
    listing = client.get("/promotion-site-details", params={"promotion_id": promotion_id}, headers=auth(admin)).json()
    return {psd["site"]["name"]: psd["capacity"] for psd in listing}


# ---------------------- FECHAS ----------------------

def test_promotion_from_start_date(client, admin):
    created = _post(client, admin, program=1, start_date=f"{YEAR}-07-01")
    assert created.status_code == 201, created.text
    body = created.json()
    assert (body["year"], body["period"]) == (YEAR, 2)
    assert body["end_date"] == f"{YEAR + 1}-06-30"  # doce meses
    assert body["label"] == f"Jul {YEAR} – Jun {YEAR + 1}"

    # Una promoción por programa y semestre de inicio.
    same_semester = _post(client, admin, program=1, start_date=f"{YEAR}-08-15")
    assert same_semester.status_code == 409
    assert same_semester.json()["detail"].startswith(f"Ya existe la promoción Jul {YEAR} – Jun {YEAR + 1} del internado;")

    social = _post(client, admin, program=2, start_date=f"{YEAR}-08-01", end_date=f"{YEAR + 1}-07-31")
    assert social.status_code == 201 and social.json()["label"] == f"Ago {YEAR} – Jul {YEAR + 1}"


def test_promotion_date_validation(client, admin):
    assert _post(client, admin, program=1).json()["detail"] == "Indica la fecha de inicio de la promoción."
    backwards = _post(client, admin, program=1, start_date=f"{YEAR}-07-01", end_date=f"{YEAR}-06-30")
    assert backwards.status_code == 422 and "posterior" in backwards.json()["detail"]
    assert _post(client, admin, program=1, start_date=f"{YEAR - 1}-07-01").status_code == 422
    assert _post(client, admin, program=1, start_date="julio").status_code == 422


def test_year_and_period_get_the_usual_dates(client, admin):
    # Internado: 1 de enero o 1 de julio; servicio social: 1 de febrero o 1 de agosto.
    internship = _post(client, admin, program=1, year=YEAR, period=1).json()
    assert (internship["start_date"], internship["end_date"]) == (f"{YEAR}-01-01", f"{YEAR}-12-31")
    social = _post(client, admin, program=2, year=YEAR, period=1).json()
    assert (social["start_date"], social["end_date"]) == (f"{YEAR}-02-01", f"{YEAR + 1}-01-31")


def test_update_promotion_dates(client, admin):
    first = _post(client, admin, program=1, start_date=f"{YEAR + 1}-01-01").json()
    url = f"/promotions/{first['promotion_id']}"

    moved = client.patch(url, headers=auth(admin), json={"start_date": f"{YEAR + 1}-07-01"})
    assert moved.status_code == 200, moved.text
    assert (moved.json()["period"], moved.json()["end_date"]) == (2, f"{YEAR + 2}-06-30")

    longer = client.patch(url, headers=auth(admin), json={"end_date": f"{YEAR + 2}-07-31"})
    assert longer.json()["end_date"] == f"{YEAR + 2}-07-31" and longer.json()["start_date"] == f"{YEAR + 1}-07-01"
    assert client.patch(url, headers=auth(admin), json={"end_date": f"{YEAR + 1}-06-30"}).status_code == 400

    other = _post(client, admin, program=1, start_date=f"{YEAR + 1}-01-01").json()
    taken = client.patch(f"/promotions/{other['promotion_id']}", headers=auth(admin), json={"start_date": f"{YEAR + 1}-07-15"})
    assert taken.status_code == 409

    # Forma anterior: año y periodo aplican las fechas habituales.
    legacy = client.patch(url, headers=auth(admin), json={"year": YEAR + 2, "period": 1})
    assert (legacy.json()["start_date"], legacy.json()["end_date"]) == (f"{YEAR + 2}-01-01", f"{YEAR + 2}-12-31")


# ---------------------- CUPOS EN BLOQUE ----------------------

def test_set_seats_in_bulk(client, admin, student, catalog):
    promotion_id = catalog["promotion"]["promotion_id"]
    site_a, site_b = catalog["site_a"]["site_id"], catalog["site_b"]["site_id"]

    saved = _seats(client, admin, promotion_id, [{"site_id": site_a, "capacity": 3}, {"site_id": site_b, "capacity": 2}])
    assert saved.status_code == 200, saved.text
    assert {psd["site"]["name"]: psd["capacity"] for psd in saved.json()} == {"Hospital A": 3, "Hospital B": 2}
    psd_b = next(psd["psd_id"] for psd in saved.json() if psd["site_id"] == site_b)

    # 0 quita el cupo; volver a darlo reutiliza el registro. Las sedes no enviadas no cambian.
    assert _seats(client, admin, promotion_id, [{"site_id": site_b, "capacity": 0}]).status_code == 200
    assert _capacities(client, admin, promotion_id) == {"Hospital A": 3}
    again = _seats(client, admin, promotion_id, [{"site_id": site_b, "capacity": 4}]).json()
    assert {psd["site_id"]: psd["psd_id"] for psd in again}[site_b] == psd_b

    assert _seats(client, admin, promotion_id, [{"site_id": site_a, "capacity": 1}, {"site_id": site_a, "capacity": 2}]).status_code == 400
    assert _seats(client, admin, promotion_id, [{"site_id": site_a, "capacity": -1}]).status_code == 422
    assert _seats(client, admin, 9999, [{"site_id": site_a, "capacity": 1}]).status_code == 404
    assert client.patch(f"/promotions/{promotion_id}/seats", headers=auth(student),
                        json={"seats": [{"site_id": site_a, "capacity": 9}]}).status_code == 403


def test_set_seats_is_all_or_nothing(client, admin, student, catalog):
    promotion_id = catalog["promotion"]["promotion_id"]
    site_a, site_b = catalog["site_a"]["site_id"], catalog["site_b"]["site_id"]
    internship = _accepted_internship(client, admin, student, catalog)
    assigned = client.patch(f"/internships/{internship['internship_id']}", headers=auth(admin), json={"site_id": site_a})
    assert assigned.status_code == 200, assigned.text

    rejected = _seats(client, admin, promotion_id, [
        {"site_id": site_b, "capacity": 5},     # válida, pero no se guarda
        {"site_id": site_a, "capacity": 0},     # tiene un interno asignado
        {"site_id": 9999, "capacity": 1},
    ])
    assert rejected.status_code == 409
    detail = rejected.json()["detail"]
    assert detail.startswith("No se guardó ningún cupo.")
    assert "Hospital A tiene 1 internos asignados" in detail and "La sede 9999 no existe." in detail
    assert _capacities(client, admin, promotion_id) == {"Hospital A": 1}


# ---------------------- SEDES POR PROGRAMA ----------------------

def test_sites_by_program(client, admin, catalog):
    headers = auth(admin)
    site_b = catalog["site_b"]
    assert site_b["for_internship"] is True and site_b["for_social_service"] is True

    clinic = client.post("/sites", headers=headers, json={
        "name": "Centro de Salud Ures", "institution_id": catalog["institution"]["institution_id"],
        "address": "Calle Juárez", "city": "Ures", "teaching_head_name": "Dra. R", "for_internship": False,
    })
    assert clinic.status_code == 201, clinic.text
    names = lambda program: [s["name"] for s in client.get("/sites", params={"program": program}, headers=headers).json()]  # noqa: E731
    assert names(1) == ["Hospital A", "Hospital B"]
    assert names(2) == ["Centro de Salud Ures", "Hospital A", "Hospital B"]

    nothing = client.post("/sites", headers=headers, json={
        "name": "Sin programa", "institution_id": catalog["institution"]["institution_id"], "address": "X",
        "city": "Ures", "teaching_head_name": "Dr. X", "for_internship": False, "for_social_service": False,
    })
    assert nothing.status_code == 422
    clinic_id = clinic.json()["site_id"]
    assert client.patch(f"/sites/{clinic_id}", headers=headers, json={"for_social_service": False}).status_code == 400

    # Una sede que no ofrece el internado no recibe cupos nuevos de una promoción de internado...
    promotion_id = catalog["promotion"]["promotion_id"]
    single = client.post("/promotion-site-details", headers=headers,
                         json={"promotion_id": promotion_id, "site_id": clinic_id, "capacity": 1})
    assert single.status_code == 400 and "no ofrece cupos para el internado" in single.json()["detail"]
    assert _seats(client, admin, promotion_id, [{"site_id": clinic_id, "capacity": 1}]).status_code == 409

    # ...pero los cupos que ya tenía se pueden seguir ajustando.
    client.patch(f"/sites/{catalog['site_a']['site_id']}", headers=headers, json={"for_internship": False})
    adjusted = _seats(client, admin, promotion_id, [{"site_id": catalog["site_a"]["site_id"], "capacity": 2}])
    assert adjusted.status_code == 200 and _capacities(client, admin, promotion_id) == {"Hospital A": 2}
