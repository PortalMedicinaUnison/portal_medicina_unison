from datetime import date

from tests.conftest import auth

SITE = {"name": "Hospital C", "address": "Calle 3", "city": "Hermosillo", "teaching_head_name": "Dra. C"}


def test_institution_crud_and_duplicates(client, admin):
    headers = auth(admin)
    created = client.post("/institutions", json={"name": "  ISSSTE  "}, headers=headers)
    assert created.status_code == 201
    institution = created.json()
    assert institution["name"] == "ISSSTE"
    assert client.post("/institutions", json={"name": "issste"}, headers=headers).status_code == 409

    updated = client.patch(f"/institutions/{institution['institution_id']}", json={"name": "ISSSTE Sonora"}, headers=headers)
    assert updated.json()["name"] == "ISSSTE Sonora"
    assert client.delete(f"/institutions/{institution['institution_id']}", headers=headers).status_code == 204
    assert client.get(f"/institutions/{institution['institution_id']}", headers=headers).status_code == 404

    # Recrear una institución dada de baja la reactiva en lugar de fallar por el nombre único.
    again = client.post("/institutions", json={"name": "ISSSTE Sonora"}, headers=headers)
    assert again.status_code == 201 and again.json()["institution_id"] == institution["institution_id"]


def test_cannot_delete_institution_with_active_sites(client, admin, catalog):
    response = client.delete(f"/institutions/{catalog['institution']['institution_id']}", headers=auth(admin))
    assert response.status_code == 409


def test_site_without_deputy_can_be_listed(client, admin, student, catalog):
    # Regresión: en main una sede sin subjefe rompía el listado completo (500).
    created = client.post("/sites", json={**SITE, "institution_id": catalog["institution"]["institution_id"]}, headers=auth(admin))
    assert created.status_code == 201, created.text
    assert created.json()["teaching_deputy_name"] is None
    listing = client.get("/sites", headers=auth(student))
    assert listing.status_code == 200
    assert {s["name"] for s in listing.json()} == {"Hospital A", "Hospital B", "Hospital C"}
    assert listing.json()[0]["institution"]["name"] == "IMSS"


def test_site_filters_and_validation(client, admin, catalog):
    headers = auth(admin)
    by_city = client.get("/sites", params={"city": "Cajeme"}, headers=headers).json()
    assert [s["name"] for s in by_city] == ["Hospital B"]
    bad_city = client.post("/sites", json={**SITE, "city": "Gotham", "institution_id": 1}, headers=headers)
    assert bad_city.status_code == 422 and bad_city.json()["detail"] == "El municipio no es válido."
    no_institution = client.post("/sites", json={**SITE, "institution_id": 999}, headers=headers)
    assert no_institution.status_code == 400


def test_site_can_change_institution(client, admin, catalog):
    headers = auth(admin)
    other = client.post("/institutions", json={"name": "SEDENA"}, headers=headers).json()
    site_id = catalog["site_b"]["site_id"]
    updated = client.patch(f"/sites/{site_id}", json={"institution_id": other["institution_id"]}, headers=headers)
    assert updated.status_code == 200
    assert updated.json()["institution"]["name"] == "SEDENA"


def test_promotions(client, admin, catalog):
    headers = auth(admin)
    year = date.today().year
    assert client.post("/promotions", json={"year": year, "period": 1}, headers=headers).status_code == 409
    assert client.post("/promotions", json={"year": year, "period": 3}, headers=headers).status_code == 422
    past = client.post("/promotions", json={"year": year - 1, "period": 1}, headers=headers)
    assert past.status_code == 422
    second = client.post("/promotions", json={"year": year, "period": 2}, headers=headers)
    assert second.status_code == 201 and second.json()["is_finished"] is False
    listing = client.get("/promotions", params={"period": 2}, headers=headers).json()
    assert [p["promotion_id"] for p in listing] == [second.json()["promotion_id"]]


def test_promotion_site_details(client, admin, catalog):
    headers = auth(admin)
    promotion_id = catalog["promotion"]["promotion_id"]
    psd = catalog["psd"]
    assert psd["occupied"] == 0 and psd["site"]["name"] == "Hospital A"
    duplicate = client.post("/promotion-site-details", json={
        "promotion_id": promotion_id, "site_id": catalog["site_a"]["site_id"], "capacity": 2}, headers=headers)
    assert duplicate.status_code == 409
    assert client.post("/promotion-site-details", json={
        "promotion_id": promotion_id, "site_id": catalog["site_b"]["site_id"], "capacity": 0}, headers=headers).status_code == 422

    listing = client.get("/promotion-site-details", params={"promotion_id": promotion_id}, headers=headers).json()
    assert [item["psd_id"] for item in listing] == [psd["psd_id"]]
    updated = client.patch(f"/promotion-site-details/{psd['psd_id']}", json={"capacity": 5}, headers=headers)
    assert updated.status_code == 200 and updated.json()["capacity"] == 5
    assert client.delete(f"/promotion-site-details/{psd['psd_id']}", headers=headers).status_code == 204


def test_cannot_delete_site_with_capacity_assigned(client, admin, catalog):
    response = client.delete(f"/sites/{catalog['site_a']['site_id']}", headers=auth(admin))
    assert response.status_code == 409
