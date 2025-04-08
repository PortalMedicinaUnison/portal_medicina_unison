from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.site import SiteRepo
from models.site import Site
from schemas.site import SiteInput
from utils.utils import orm_to_dict


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
    new_site_response = orm_to_dict(created_site)
    return new_site_response

def get_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    read_site = site_repo.get_by_id(site_id)
    if read_site is None:
        return None
    site_response = orm_to_dict(read_site)
    return site_response

def get_all_sites(db: Session):
    site_repo = SiteRepo(db)
    sites = site_repo.get_all()
    sites_response = [orm_to_dict(site) for site in sites]
    return sites_response

def update_site(site_id: int, site: SiteInput, db: Session):
    pass

def delete_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    return site_repo.delete(site_id)