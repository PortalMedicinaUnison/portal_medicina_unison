import pytest
from sqlalchemy.orm import Session
from models.site import Site, Institution
from repos.site import SiteRepo, InstitutionRepo
from schemas.site import InstitutionInput, SiteInput
from controllers.site import (
    create_institution, get_institution, get_all_institutions, update_institution, delete_institution,
    create_site, get_site, get_all_sites, update_site, delete_site
)

def test_create_institution(db_session: Session):
    institution_input = InstitutionInput(name="ISSSTE")
    result = create_institution(institution_input, db_session)

    institution_repo = InstitutionRepo(db_session)
    db_inst = institution_repo.get_by_id(result["institution_id"])
    assert db_inst is not None
    assert db_inst.institution_id == result["institution_id"]
    assert db_inst.name == "ISSSTE"

def test_get_institution(db_session: Session):
    repo = InstitutionRepo(db_session)
    inst = repo.create(Institution(name="IMSS BIENESTAR"))
    result = get_institution(inst.institution_id, db_session)

    assert result is not None
    assert result["name"] == "IMSS BIENESTAR"

def test_get_all_institutions(db_session: Session):
    repo = InstitutionRepo(db_session)
    i1 = repo.create(Institution(name="IMSS"))
    i2 = repo.create(Institution(name="ISSSTESON"))

    result = get_all_institutions(db_session)
    names = [i["name"] for i in result]
    assert "IMSS" in names
    assert "ISSSTESON" in names

def test_update_institution(db_session: Session):
    repo = InstitutionRepo(db_session)
    inst = repo.create(Institution(name="IMS"))

    update_input = InstitutionInput(name="IMSS")
    result = update_institution(inst.institution_id, update_input, db_session)
    assert result["name"] == "IMSS"

def test_delete_institution(db_session: Session):
    repo = InstitutionRepo(db_session)
    inst = repo.create(Institution(name="SEDENA"))
    assert delete_institution(inst.institution_id, db_session) is True


def test_create_site(db_session: Session):
    inst_repo = InstitutionRepo(db_session)
    inst = inst_repo.create(Institution(name="ISSSTE"))

    site_input = SiteInput(
        name="Hospital General 'Dr. Fernando Ocaranza'",
        institution_id=inst.institution_id,
        address="Blvd. Morelos y Av. Cuatro",
        city="Hermosillo",
        capacity=14,
        teaching_head="Dra. Sayil de la Torre",
        teaching_deputy="Dr. Yayo"
    )
    result = create_site(site_input, db_session)
    assert result["name"] == "Hospital General 'Dr. Fernando Ocaranza'"
    assert result["institution_id"] == inst.institution_id

def test_get_site(db_session: Session):
    inst_repo = InstitutionRepo(db_session)
    inst = inst_repo.create(Institution(name="SEDENA"))

    site_repo = SiteRepo(db_session)
    site = site_repo.create(Site(
        name="North Campus",
        institution_id=inst.institution_id,
        address="Calle Norte 123",
        city="Hermosillo",
        capacity=2000,
        teaching_head="Dr. García",
        teaching_deputy="Dra. Martínez"
    ))
    result = get_site(site.site_id, db_session)

    assert result is not None
    assert result["name"] == "North Campus"

def test_get_all_sites(db_session: Session):
    inst_repo = InstitutionRepo(db_session)
    inst = inst_repo.create(Institution(name="InstY"))

    site_repo = SiteRepo(db_session)
    s1 = site_repo.create(Site(
        name="Campus A",
        institution_id=inst.institution_id,
        address="Dir A",
        city="CityA",
        capacity=100,
        teaching_head="H1",
        teaching_deputy="D1"
    ))
    s2 = site_repo.create(Site(
        name="Campus B",
        institution_id=inst.institution_id,
        address="Dir B",
        city="CityB",
        capacity=200,
        teaching_head="H2",
        teaching_deputy="D2"
    ))
    result = get_all_sites(db_session)
    names = [s["name"] for s in result]
    assert "Campus A" in names
    assert "Campus B" in names

def test_update_site(db_session: Session):
    inst_repo = InstitutionRepo(db_session)
    inst = inst_repo.create(Institution(name="InstZ"))

    site_repo = SiteRepo(db_session)
    site = site_repo.create(Site(
        name="Old Site",
        institution_id=inst.institution_id,
        address="Old Addr",
        city="OldCity",
        capacity=10,
        teaching_head="H3",
        teaching_deputy="D3"
    ))
    update_input = SiteInputUpdate(
        name="Updated Site",
        capacity=20
    )
    result = update_site(site.site_id, update_input, db_session)
    assert result["name"] == "Updated Site"
    assert result["capacity"] == 20

def test_delete_site(db_session: Session):
    inst_repo = InstitutionRepo(db_session)
    inst = inst_repo.create(Institution(name="InstDel"))

    site_repo = SiteRepo(db_session)
    site = site_repo.create(Site(
        name="SiteDel",
        institution_id=inst.institution_id,
        address="AddrDel",
        city="CityDel",
        capacity=5,
        teaching_head="H4",
        teaching_deputy="D4"
    ))
    assert delete_site(site.site_id, db_session) is True
