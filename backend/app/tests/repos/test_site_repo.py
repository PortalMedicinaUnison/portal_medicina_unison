import pytest
from models.site import Site, SiteTypeEnum
from repos.site import SiteRepo


def test_create_site(db_session):
    site_repo = SiteRepo(db_session)
    new_site = Site(
        name="Test Site",
        institution_id=1,
        site_type=SiteTypeEnum.HOSPITAL,
        address="123 Test St",
        city="Test City",
        state="Test State",
        capacity=100,
        director="Dr. Test",
        subdirector="Dr. Example",
        contact_email="cdscsa@example.com",
        contact_phone="555-0000",
        is_available=True,
        created_by=1
    )
    site_repo.create(new_site)
    site_from_db = site_repo.get_by_id(new_site.site_id)
    assert site_from_db is not None
    assert site_from_db.name == "Test Site"

def test_get_all_sites(db_session):
    site_repo = SiteRepo(db_session)
    sites = [
        Site(
            name="Site One",
            institution_id=1,
            site_type=SiteTypeEnum.CLINIC,
            address="456 Clinic Ave",
            city="Medic City",
            state="CareState",
            capacity=200,
            director="Dr. Care",
            subdirector="Dr. Help",
            contact_email="ans@gmail.com",
            contact_phone="555-5678",
            is_available=True,
            created_by=1
        ),
        Site(
                name="Site Two",
                institution_id=1,
                site_type=SiteTypeEnum.LABORATORY,
                address="789 Lab St",
                city="Science City",
                state="LabState",
                capacity=300,
                director="Dr. Science",
                subdirector="Dr. Experiment",
                contact_email="jorg@gmail.com",
                contact_phone="555-1234",
                is_available=True,
                created_by=1
        )
    ]
    for site in sites:
        site_repo.create(site)
    all_sites = site_repo.get_all()
    assert len(all_sites) >= 2

def test_update_site(db_session):
    site_repo = SiteRepo(db_session)
    site = Site(
        name="Site Update",
        institution_id=1,
        site_type=SiteTypeEnum.OFFICE,
        address="123 Update St",
        city="Update City",
        state="Update State",
        capacity=150,
        director="Dr. Update",
        subdirector="Dr. Change",
        contact_email="fjdsa@gmail.com",
        contact_phone="555-9999",
        is_available=True,
        created_by=1
    )
    
    site_repo.create(site)
    site_repo.update(site.site_id, {"name": "Updated Name"})
    updated_site = site_repo.get_by_id(site.site_id)
    assert updated_site.name == "Updated Name"

def test_delete_site(db_session):
    site_repo = SiteRepo(db_session)
    site = Site(
        name="Site Update",
        institution_id=1,
        site_type=SiteTypeEnum.OFFICE,
        address="123 Update St",
        city="Update City",
        state="Update State",
        capacity=150,
        director="Dr. Update",
        subdirector="Dr. Change",
        contact_email="fjdsa@gmail.com",
        contact_phone="555-9999",
        is_available=True,
        created_by=1
    )
    site_repo.create(site)
    assert site_repo.delete(site.site_id) is True
