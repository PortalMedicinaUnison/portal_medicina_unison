from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.site import SiteInput, SitePartialInput
from core.dependencies import get_db
from controllers.site import (
    create_site, update_site, read_all_sites, read_single_site, delete_site
)

site_router = APIRouter(prefix="/sites", tags=["Sitios"])

@site_router.post('/', response_model=SiteInput)
async def create_site_route(site: SiteInput, db: Session = Depends(get_db)):
    return create_site(site, db)

@site_router.get('/', response_model=List[SiteInput])
async def read_sites_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_all_sites(skip, limit, db)

@site_router.get('/{site_id}', response_model=SiteInput)
async def read_site_route(site_id: int, db: Session = Depends(get_db)):
    return read_single_site(site_id, db)

@site_router.patch('/{site_id}', response_model=SiteInput)
async def update_site_route(site_id: int, site: SitePartialInput, db: Session = Depends(get_db)):
    return update_site(site_id, site, db)

@site_router.delete('/{site_id}')
async def delete_site_route(site_id: int, db: Session = Depends(get_db)):
    delete_site(site_id, db)
    return