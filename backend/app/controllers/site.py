from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.site import SiteRepo, InstitutionRepo
from models.site import Site, Institution
from schemas.site import SiteInput, InstitutionInput
from utils.utils import orm_to_dict

#---------------SITE-------------------

def create_site(site: SiteInput, db: Session):
    site_repo = SiteRepo(db)
    new_site = Site(
        name = site.name,
        institution_id = site.institution_id,
        address = site.address,
        city = site.city,
        teaching_head_name = site.teaching_head_name,
        teaching_head_email = site.teaching_head_email,
        teaching_head_phone = site.teaching_head_phone,
        teaching_deputy_name = site.teaching_deputy_name,
        teaching_deputy_email = site.teaching_deputy_email,
        teaching_deputy_phone = site.teaching_deputy_phone,
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

def update_site(site_id: int, site_input: SiteInput, db: Session):
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
    institution_repo = InstitutionRepo(db)
    new_institution = Institution(
        name = institution.name
    )
    created_institution = institution_repo.create(new_institution)
    new_institution_response = orm_to_dict(created_institution)
    return new_institution_response

def get_institution(institution_id: int, db: Session):
    institution_repo = InstitutionRepo(db)
    read_institution = institution_repo.get_by_id(institution_id)
    if read_institution is None:
        return None
    institution_response = orm_to_dict(read_institution)
    return institution_response

def get_all_institutions(db: Session):
    institution_repo = InstitutionRepo(db)
    institutions = institution_repo.get_all()
    institutions_response = [orm_to_dict(institution) for institution in institutions]
    return institutions_response

def update_institution(institution_id: int, institution: InstitutionInput, db: Session):
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