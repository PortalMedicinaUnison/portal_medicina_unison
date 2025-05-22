from .base import BaseRepo
from models.site import Site, Institution

# ---------------  SITE  ----------------------

class SiteRepo(BaseRepo):
    
    def create(self, data: Site) -> Site:
        """Crea un nuevo sitio en la base de datos."""
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_by_id(self, site_id: int) -> Site:
        """Obtiene un sitio por su ID."""
        return self.session.query(Site).filter(Site.site_id == site_id).first()
    
    def get_all(self):
        """Obtiene todos los sitios."""
        return self.session.query(Site).all()
    
    def update(self, site_id: int, data: dict) -> Site:
        """Actualiza los datos de un sitio."""
        site = self.get_by_id(site_id)
        if site:
            for key, value in data.items():
                if hasattr(site, key):
                    setattr(site, key, value)
            self.session.commit()
            self.session.refresh(site)
        return site
    
    def delete(self, site_id: int) -> bool:
        """Elimina un sitio por su ID."""
        site = self.get_by_id(site_id)
        if site:
            site.is_active = False
            self.session.commit()
            return True
        return False

# ---------------  INSTITUTION  ----------------------

class InstitutionRepo(BaseRepo):
    
    def create(self, data: Institution) -> Institution:
        """Crea una nueva institución en la base de datos."""
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_by_id(self, institution_id: int) -> Institution:
        """Obtiene una institución por su ID."""
        return self.session.query(Institution).filter(Institution.institution_id == institution_id).first()
    
    def get_all(self):
        """Obtiene todas las instituciones."""
        return self.session.query(Institution).all()
    
    def update(self, institution_id: int, data: dict) -> Institution:
        """Actualiza los datos de una institución."""
        institution = self.get_by_id(institution_id)
        if institution:
            for key, value in data.items():
                if hasattr(institution, key):
                    setattr(institution, key, value)
            self.session.commit()
            self.session.refresh(institution)
        return institution
    
    def delete(self, institution_id: int) -> bool:
        """Elimina una institución por su ID."""
        institution = self.get_by_id(institution_id)
        if institution:
            institution.is_active = False
            self.session.commit()
            return True
        return False


    
