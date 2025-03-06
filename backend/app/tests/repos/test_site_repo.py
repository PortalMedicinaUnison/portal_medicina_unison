import pytest
from models.site import Site, SiteTypeEnum
from repos.site import SiteRepo

def test_create_site(db_session):
    repo = SiteRepo(db_session)
    new_site = Site(site_id=1, admin_id=1, name="Test Site", site_type=1, contact_name="John Doe", is_available=True)
    repo.create(new_site)
    site_from_db = repo.get_by_id(1)
    assert site_from_db is not None
    assert site_from_db.name == "Test Site"


def test_get_all_sites(db_session):
    repo = SiteRepo(db_session)
    sites = [
        Site(site_id=2, admin_id=1, name="Site One", site_type=1, contact_name="Alice"),
        Site(site_id=3, admin_id=2, name="Site Two", site_type=2, contact_name="Bob")
    ]
    for site in sites:
        repo.create(site)
    all_sites = repo.get_all()
    assert len(all_sites) >= 2

def test_update_site(db_session):
    repo = SiteRepo(db_session)
    site = Site(site_id=4, admin_id=1, name="Old Name", site_type=1, contact_name="Charlie")
    repo.create(site)
    repo.update(4, {"name": "Updated Name"})
    updated_site = repo.get_by_id(4)
    assert updated_site.name == "Updated Name"

def test_delete_site(db_session):
    repo = SiteRepo(db_session)
    site = Site(site_id=5, admin_id=1, name="ToDelete", site_type=1, contact_name="Dave")
    repo.create(site)
    assert repo.delete(5) is True
    assert repo.get_by_id(5) is None
