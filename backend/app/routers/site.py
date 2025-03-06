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
    return create_site(site, db)

@site_router.get('/', response_model=List[SiteInput])
async def read_sites_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_all_sites(db, skip, limit)

@site_router.get('/', response_model=SiteInput)
async def read_site_route(site_id: int, db: Session = Depends(get_db)):
    return read_single_site(site_id, db)

@site_router.patch('/', response_model=SiteInput)
async def update_site_route(site_id: int, site: SiteInput, db: Session = Depends(get_db)):
    return update_site(site_id, site, db)

@site_router.delete('/', response_model=SiteInput)
async def delete_site_route(site_id: int, db: Session = Depends(get_db)):
    return delete_site(site_id, db)