from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.site import SiteRepo
from models.site import Site
from schemas.site import SiteInput

def create_site(site: SiteInput, db: Session):
    site_repo = SiteRepo(db)
    new_site = Site(
        admin_id = site.admin_id,
        name = site.name,
        site_type = site.site_type,
        address = site.address,
        city = site.city,
        state = site.state,
        country = site.country,
        capacity = site.capacity,
        contact_name = site.contact_name,
        contact_email = site.contact_email,
        contact_phone = site.contact_phone,
        is_available = site.is_available
    )
    created_site = site_repo.create(new_site)
    return created_site.dict()

def read_all_sites(db: Session):
    site_repo = SiteRepo(db)
    read_sites = site_repo.get_all()
    return [model.dict() for model in read_sites]

def read_single_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    read_site = site_repo.get_by_id(site_id)
    return read_site.dict()

def update_site(site_id: int, site: SiteInput, db: Session):
    pass
    # site_repo = SiteRepo(db)
    # updated_site = site_repo.update(site_id, site)
    # return updated_site.dict()

def delete_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    deleted_site = site_repo.delete(site_id)
    return deleted_site.dict()