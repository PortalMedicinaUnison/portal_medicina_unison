from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.site import SiteRepo, InstitutionRepo
from models.site import Site, Institution
from schemas.site import (
    SiteInput, SiteInputUpdate,
    InstitutionInput, InstitutionInputUpdate
)
from utils.utils import orm_to_dict, map_to_model


#---------------SITE-------------------

def create_site(site: SiteInput, db: Session):
    new_site = map_to_model(site, Site)
    site_repo = SiteRepo(db)
    created_site = site_repo.create(new_site)
    new_site_response = orm_to_dict(created_site)
    return new_site_response

def get_all_sites(db: Session):
    site_repo = SiteRepo(db)
    sites = site_repo.get_all()
    if not sites:
        return []
    sites_response = [orm_to_dict(site) for site in sites]
    return sites_response

def get_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    read_site = site_repo.get_by_id(site_id)
    if not read_site:
        return None
    site_response = orm_to_dict(read_site)
    return site_response

def update_site(site_id: int, site_input: SiteInputUpdate, db: Session):
    update_data = site_input.dict(exclude_unset=True)
    site_repo = SiteRepo(db)
    updated_site = site_repo.update(site_id, update_data)
    if not updated_site:
        return None
    site_response = orm_to_dict(updated_site)
    return site_response
    
def delete_site(site_id: int, db: Session):
    site_repo = SiteRepo(db)
    return site_repo.delete(site_id)

#---------------INSTITUTION-------------------

def create_institution(institution: InstitutionInput, db: Session):
    new_institution = map_to_model(institution, Institution)
    institution_repo = InstitutionRepo(db)
    created_institution = institution_repo.create(new_institution)
    new_institution_response = orm_to_dict(created_institution)
    return new_institution_response

def get_all_institutions(db: Session):
    institution_repo = InstitutionRepo(db)
    institutions = institution_repo.get_all()
    if not institutions:
        return []
    institutions_response = [orm_to_dict(institution) for institution in institutions]
    return institutions_response

def get_institution(institution_id: int, db: Session):
    institution_repo = InstitutionRepo(db)
    read_institution = institution_repo.get_by_id(institution_id)
    if not read_institution:
        return None
    institution_response = orm_to_dict(read_institution)
    return institution_response

def update_institution(institution_id: int, institution: InstitutionInputUpdate, db: Session):
    update_data = institution.dict(exclude_unset=True)
    institution_repo = InstitutionRepo(db)
    updated_institution = institution_repo.update(institution_id, update_data)
    if not updated_institution:
        return None
    institution_response = orm_to_dict(updated_institution)
    return institution_response

def delete_institution(institution_id: int, db: Session):
    institution_repo = InstitutionRepo(db)
    return institution_repo.delete(institution_id)