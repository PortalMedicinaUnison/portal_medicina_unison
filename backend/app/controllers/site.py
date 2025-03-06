from sqlalchemy.orm import Session
from schemas.site import SiteInput
from fastapi import HTTPException, status

def create_site(site: SiteInput, db: Session):
    pass

def read_all_sites(skip: int, limit: int, db: Session):
    pass

def read_single_site(site_id: int, db: Session):
    pass

def update_site(site_id: int, site: SiteInput, db: Session):
    pass

def delete_site(site_id: int, db: Session):
    pass