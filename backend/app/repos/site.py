from .base import BaseRepo
from models.site import Site, Institution

# ----------------------  SITE  ----------------------

class SiteRepo(BaseRepo):
    def create(self, data: Site) -> Site:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> list[Site]:
        return self.session.query(Site).filter(
                Site.is_active == True
            ).all()
    
    def get_by_id(self, site_id: int) -> Site:
        return self.session.query(Site).filter(
                Site.site_id == site_id,
                Site.is_active == True,
            ).first()
    
    def update(self, site_id: int, data: dict) -> Site:
        site = self.get_by_id(site_id)
        if site:
            for key, value in data.items():
                if hasattr(site, key):
                    setattr(site, key, value)
            self.session.commit()
            self.session.refresh(site)
        return site
    
    def delete(self, site_id: int) -> bool:
        site = self.get_by_id(site_id)
        if site:
            site.is_active = False
            self.session.commit()
            return True
        return False

# ----------------------  INSTITUTION  ----------------------

class InstitutionRepo(BaseRepo):
    def create(self, data: Institution) -> Institution:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> list[Institution]:
        return self.session.query(Institution).filter(
                Institution.is_active == True
            ).all()
    
    def get_by_id(self, institution_id: int) -> Institution:
        return self.session.query(Institution).filter(
                Institution.institution_id == institution_id,
                Institution.is_active == True,
            ).first()
    
    def update(self, institution_id: int, data: dict) -> Institution:
        institution = self.get_by_id(institution_id)
        if institution:
            for key, value in data.items():
                if hasattr(institution, key):
                    setattr(institution, key, value)
            self.session.commit()
            self.session.refresh(institution)
        return institution
    
    def delete(self, institution_id: int) -> bool:
        institution = self.get_by_id(institution_id)
        if institution:
            institution.is_active = False
            self.session.commit()
            return True
        return False