from .base import BaseRepo
from models.site import Site

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
            data = data.dict(exclude_unset=True)
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
            self.session.delete(site)
            self.session.commit()
            return True
        return False


    
