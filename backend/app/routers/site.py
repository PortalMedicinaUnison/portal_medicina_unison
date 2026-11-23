from typing import List, Optional

from fastapi import APIRouter, status

from controllers import site as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from schemas.site import InstitutionInput, InstitutionOutput, InstitutionUpdate, SiteInput, SiteOutput, SiteUpdate

# ----------------------  SITE  ----------------------

site_router = APIRouter(prefix="/sites", tags=["Sedes"])


@site_router.get("", response_model=List[SiteOutput])
def list_sites(_user: CurrentUser, db: DbSession, institution_id: Optional[int] = None, city: Optional[str] = None):
    return controller.list_sites(db, institution_id=institution_id, city=city)


@site_router.post("", response_model=SiteOutput, status_code=status.HTTP_201_CREATED)
def create_site(data: SiteInput, _admin: AdminUser, db: DbSession):
    return controller.create_site(db, data)


@site_router.get("/{site_id}", response_model=SiteOutput)
def get_site(site_id: int, _user: CurrentUser, db: DbSession):
    return controller.get_site(db, site_id)


@site_router.patch("/{site_id}", response_model=SiteOutput)
def update_site(site_id: int, data: SiteUpdate, _admin: AdminUser, db: DbSession):
    return controller.update_site(db, site_id, data)


@site_router.delete("/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_site(db, site_id)


# ----------------------  INSTITUTION  ----------------------

institution_router = APIRouter(prefix="/institutions", tags=["Instituciones"])


@institution_router.get("", response_model=List[InstitutionOutput])
def list_institutions(_user: CurrentUser, db: DbSession):
    return controller.list_institutions(db)


@institution_router.post("", response_model=InstitutionOutput, status_code=status.HTTP_201_CREATED)
def create_institution(data: InstitutionInput, _admin: AdminUser, db: DbSession):
    return controller.create_institution(db, data)


@institution_router.get("/{institution_id}", response_model=InstitutionOutput)
def get_institution(institution_id: int, _user: CurrentUser, db: DbSession):
    return controller.get_institution(db, institution_id)


@institution_router.patch("/{institution_id}", response_model=InstitutionOutput)
def update_institution(institution_id: int, data: InstitutionUpdate, _admin: AdminUser, db: DbSession):
    return controller.update_institution(db, institution_id, data)


@institution_router.delete("/{institution_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_institution(institution_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_institution(db, institution_id)
