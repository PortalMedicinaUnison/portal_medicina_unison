from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.site import SiteInput, InstitutionInput
from core.dependencies import get_db
from controllers.site import (
    create_site,
    update_site,
    get_site,
    get_all_sites,
    delete_site
)
from controllers.site import (
    create_institution,
    update_institution,
    get_institution,
    get_all_institutions,
    delete_institution
)

#---------------SITE-------------------

site_router = APIRouter(prefix="/sites", tags=["Sitios"])

@site_router.post('/', response_model=SiteInput)
async def create_site_route(site: SiteInput, db: Session = Depends(get_db)):
    site = create_site(site, db)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el sitio")
    return site

@site_router.get('/{site_id}', response_model=SiteInput)
async def get_site_route(site_id: int, db: Session = Depends(get_db)):
    site =  get_site(site_id, db)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sitio no encontrado")
    return site

@site_router.get('/', response_model=List[SiteInput])
async def get_sites_route(db: Session = Depends(get_db)):
    sites =  get_all_sites(db)
    if not sites:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sitio no encontrado")
    return sites

@site_router.patch('/{site_id}', response_model=SiteInput)
async def update_site_route(site_id: int, site: SiteInput, db: Session = Depends(get_db)):
    site =  update_site(site_id, site, db)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sitio no encontrado")
    return site

@site_router.delete('/{site_id}')
async def delete_site_route(site_id: int, db: Session = Depends(get_db)):
    site = delete_site(site_id, db)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sitio no encontrado")
    return site

institution_router = APIRouter(prefix="/institutions", tags=["Instituciones"])

@institution_router.post('/', response_model=InstitutionInput)
async def create_institution_route(institution: InstitutionInput, db: Session = Depends(get_db)):
    institution = create_institution(institution, db)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear la institución")
    return institution

@institution_router.get('/{institution_id}', response_model=InstitutionInput)
async def get_institution_route(institution_id: int, db: Session = Depends(get_db)):
    institution =  get_institution(institution_id, db)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institución no encontrada")
    return institution

@institution_router.get('/', response_model=List[InstitutionInput])
async def get_institutions_route(db: Session = Depends(get_db)):
    institutions =  get_all_institutions(db)
    if not institutions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institución no encontrada")
    return institutions

@institution_router.patch('/{institution_id}', response_model=InstitutionInput)
async def update_institution_route(institution_id: int, institution: InstitutionInput, db: Session = Depends(get_db)):
    institution =  update_institution(institution_id, institution, db)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institución no encontrada")
    return institution

@institution_router.delete('/{institution_id}')
async def delete_institution_route(institution_id: int, db: Session = Depends(get_db)):
    institution = delete_institution(institution_id, db)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institución no encontrada")
    return institution