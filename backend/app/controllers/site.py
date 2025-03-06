from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.site import SiteRepo
from models.site import Site
from schemas.site import SiteInput, SitePartialInput

def create_site(site: SiteInput, db: Session):
    site_repo = SiteRepo(db)
    new_site = Site(**site.model_dump())
    created_site = site_repo.create(new_site)
    return created_site

def read_all_sites(skip: int, limit: int, db: Session):
    site_repo = SiteRepo(db)
    read_sites = site_repo.get_all()
    return read_sites

def read_single_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    read_site = site_repo.get_by_id(site_id)
    return read_site

def update_site(site_id: int, site: SiteInput, db: Session):
    site_repo = SiteRepo(db)
    updated_site = site_repo.update(site_id, site)
    return updated_site

def delete_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    deleted_site = site_repo.delete(site_id)
    return deleted_site