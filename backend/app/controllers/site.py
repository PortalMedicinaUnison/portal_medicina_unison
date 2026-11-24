from typing import List, Optional

from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, not_found
from models.site import Institution, Site
from repos.internship import InternshipRepo
from repos.promotion import PromotionSiteDetailRepo
from repos.social_service import SocialServiceRepo
from repos.site import InstitutionRepo, SiteRepo
from schemas.site import InstitutionInput, InstitutionUpdate, SiteInput, SiteUpdate


# ---------------------- INSTITUTION ----------------------

def list_institutions(db: Session) -> List[Institution]:
    return InstitutionRepo(db).list()


def get_institution(db: Session, institution_id: int) -> Institution:
    institution = InstitutionRepo(db).get(institution_id)
    if institution is None:
        raise not_found("Institución no encontrada.")
    return institution


def create_institution(db: Session, data: InstitutionInput) -> Institution:
    repo = InstitutionRepo(db)
    existing = repo.get_by_name(data.name)
    if existing and existing.is_active:
        raise conflict("Ya existe una institución con ese nombre.")
    if existing:
        return repo.update(existing, {"name": data.name, "is_active": True})
    return repo.add(Institution(name=data.name))


def update_institution(db: Session, institution_id: int, data: InstitutionUpdate) -> Institution:
    repo = InstitutionRepo(db)
    institution = get_institution(db, institution_id)
    payload = data.model_dump(exclude_unset=True)
    if "name" in payload:
        duplicate = repo.get_by_name(payload["name"])
        if duplicate and duplicate.institution_id != institution.institution_id:
            raise conflict("Ya existe una institución con ese nombre.")
    return repo.update(institution, payload)


def delete_institution(db: Session, institution_id: int) -> None:
    institution = get_institution(db, institution_id)
    if SiteRepo(db).count_active_by_institution(institution_id):
        raise conflict("La institución tiene sedes activas; elimínalas o cámbialas de institución primero.")
    InstitutionRepo(db).soft_delete(institution)


# ---------------------- SITE ----------------------

def list_sites(db: Session, institution_id: Optional[int], city: Optional[str]) -> List[Site]:
    return SiteRepo(db).list(institution_id=institution_id, city=city)


def get_site(db: Session, site_id: int) -> Site:
    site = SiteRepo(db).get(site_id)
    if site is None:
        raise not_found("Sede no encontrada.")
    return site


def _check_institution(db: Session, institution_id: int) -> None:
    if InstitutionRepo(db).get(institution_id) is None:
        raise bad_request("La institución seleccionada no existe.")


def create_site(db: Session, data: SiteInput) -> Site:
    repo = SiteRepo(db)
    _check_institution(db, data.institution_id)
    payload = data.model_dump()
    existing = repo.get_by_name(data.name)
    if existing and existing.is_active:
        raise conflict("Ya existe una sede con ese nombre.")
    if existing:
        return repo.update(existing, {**payload, "is_active": True})
    return repo.add(Site(**payload))


def update_site(db: Session, site_id: int, data: SiteUpdate) -> Site:
    repo = SiteRepo(db)
    site = get_site(db, site_id)
    payload = data.model_dump(exclude_unset=True)
    if "institution_id" in payload:
        _check_institution(db, payload["institution_id"])
    if "name" in payload:
        duplicate = repo.get_by_name(payload["name"])
        if duplicate and duplicate.site_id != site.site_id:
            raise conflict("Ya existe una sede con ese nombre.")
    return repo.update(site, payload)


def delete_site(db: Session, site_id: int) -> None:
    site = get_site(db, site_id)
    if InternshipRepo(db).count_by_site(site_id) or SocialServiceRepo(db).count_by_site(site_id):
        raise conflict("La sede tiene estudiantes asignados; reasígnalos antes de eliminarla.")
    if PromotionSiteDetailRepo(db).list(site_id=site_id):
        raise conflict("La sede tiene cupos en alguna promoción; elimínalos antes de eliminarla.")
    SiteRepo(db).soft_delete(site)
