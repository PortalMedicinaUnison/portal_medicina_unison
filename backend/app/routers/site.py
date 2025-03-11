from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.site import SiteInput
from core.dependencies import get_db
from controllers.site import (
    create_site, update_site, read_all_sites, read_single_site, delete_site
)

site_router = APIRouter(prefix="/sites", tags=["Sitios"])

@site_router.post('/', response_model=SiteInput)
async def create_site_route(site: SiteInput, db: Session = Depends(get_db)):
    site = create_site(site, db)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el sitio")
    return site

@site_router.get('/', response_model=List[SiteInput])
async def read_sites_route(db: Session = Depends(get_db)):
    sites =  read_all_sites(db)
    if not sites:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sitio no encontrado")
    return sites

@site_router.get('/{site_id}', response_model=SiteInput)
async def read_site_route(site_id: int, db: Session = Depends(get_db)):
    site =  read_single_site(site_id, db)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sitio no encontrado")
    return site

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