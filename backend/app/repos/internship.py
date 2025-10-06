from .base import BaseRepo
from models.internship import  InternshipApplication, Internship, InternshipDocument, ApplicationStatusEnum
from typing import List, Optional


# ----------------------  INTERNSHIP  ----------------------

class InternshipRepo(BaseRepo):
    def create(self, data: Internship) -> Internship:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> List[Internship]:
        return self.session.query(Internship).filter(
            Internship.is_active == True
        ).all()

    def get_by_id(self, internship_id: int) -> Internship:
        return self.session.query(Internship).filter(
            Internship.internship_id == internship_id,
            Internship.is_active == True
        ).first()

    def get_by_academic_id(self, academic_id: str) -> List[Internship]:
        return (
            self.session.query(Internship)
            .join(Internship.application)
            .filter(
                InternshipApplication.academic_id == academic_id,
                Internship.is_active == True
            ).all()
        )
    
    def get_latest_by_academic_id(self, academic_id: str) -> Optional[Internship]:
        return (
            self.session.query(Internship)
            .join(Internship.application)
            .filter(
                InternshipApplication.academic_id == academic_id,
                Internship.is_active == True
            )
            .order_by(Internship.created_at.desc())
        ).first()

    def get_by_promotion_id(self, promotion_id: int) -> List[Internship]:
        return (
            self.session.query(Internship)
            .join(Internship.application)
            .filter(
                InternshipApplication.promotion_id == promotion_id,
                Internship.is_active == True
            ).all()
        )
    

    def get_by_application_id(self, application_id: int) -> Optional[Internship]:
        return self.session.query(Internship).filter(
            Internship.application_id == application_id,
            Internship.is_active == True
        ).first()

    def get_by_site_id(self, site_id: int) -> List[Internship]:
        return self.session.query(Internship).filter(
            Internship.site_id == site_id,
            Internship.is_active == True
        ).all()

    def update(self, internship_id: int, data: dict) -> Internship:
        internship = self.get_by_id(internship_id)
        if internship:
            for key, value in data.items():
                if hasattr(internship, key):
                    setattr(internship, key, value)
            self.session.commit()
            self.session.refresh(internship)
        return internship

    def delete(self, internship_id: int) -> bool:
        internship = self.get_by_id(internship_id)
        if internship:
            internship.is_active = False
            self.session.commit()
            return True
        return False

    def update_without_commit(self, application_id: int, data: dict) -> Optional[InternshipApplication]:
        application = self.get_by_id(application_id)
        if application:
            for key, value in data.items():
                if hasattr(application, key):
                    setattr(application, key, value)
        return application

    def create_without_commit(self, data: Internship) -> Internship:
        self.session.add(data)
        return data

# ---------------  INTERNSHIP APPLICATION  ----------------------

class InternshipApplicationRepo(BaseRepo):
    def create(self, data: InternshipApplication) -> InternshipApplication:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> List[InternshipApplication]:
        return self.session.query(InternshipApplication).filter(
            InternshipApplication.is_active == True
        ).all()

    def get_by_id(self, application_id: int) -> Optional[InternshipApplication]:
        return (self.session.query(InternshipApplication).filter(
            InternshipApplication.application_id == application_id,
            InternshipApplication.is_active == True
        ).first())
    
    def get_by_academic_id(self, academic_id: str) -> List[InternshipApplication]:
        return (self.session.query(InternshipApplication).filter(
            InternshipApplication.academic_id == academic_id,
            InternshipApplication.is_active == True
        ).all())
    
    def get_latest_by_academic_id(self, academic_id: str) -> Optional[InternshipApplication]:
        q = (self.session.query(InternshipApplication)
            .filter(
                InternshipApplication.academic_id == academic_id,
                InternshipApplication.is_active == True,
            )
            .order_by(InternshipApplication.created_at.desc()))
        return q.first()

    def get_by_id_for_update(self, application_id: int) -> Optional[InternshipApplication]:
        # Para flujo (aceptar/declinar + crear internship)
        return (self.session.query(InternshipApplication).filter(
            InternshipApplication.application_id == application_id,
            InternshipApplication.is_active == True)
        .with_for_update()
        .first())
    
    def update(self, application_id: int, data: dict) -> Optional[InternshipApplication]:
        application = self.get_by_id(application_id)
        if application:
            for key, value in data.items():
                if hasattr(application, key):
                    setattr(application, key, value)
            self.session.commit()
            self.session.refresh(application)
        return application

    def delete(self, application_id: int) -> bool:
        application = self.get_by_id(application_id)
        if application:
            application.is_active = False
            self.session.commit()
            return True
        return False
    
# ---------------  INTERNSHIP DOCUMENT  ----------------------

class InternshipDocumentRepo(BaseRepo):
    def create(self, data: InternshipDocument) -> InternshipDocument:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all_by_internship(self, internship_id: int) -> List[InternshipDocument]:
        return self.session.query(InternshipDocument).filter(
            InternshipDocument.internship_id == internship_id,
            InternshipDocument.is_active == True
        ).all()

    def get_by_id(self, internship_id: int, document_id: int) -> Optional[InternshipDocument]:
        return (self.session.query(InternshipDocument).filter(
            InternshipDocument.internship_id == internship_id,
            InternshipDocument.document_id == document_id,
            InternshipDocument.is_active == True
        ).first())

    def update(self, internship_id: int, document_id: int, data: dict) -> Optional[InternshipDocument]:
        doc = self.get_by_id(internship_id, document_id)
        if doc:
            for key, value in data.items():
                if hasattr(doc, key):
                    setattr(doc, key, value)
            self.session.commit()
            self.session.refresh(doc)
        return doc

    def delete(self, internship_id: int, document_id: int) -> bool:
        doc = self.get_by_id(internship_id, document_id)
        if doc:
            doc.is_active = False
            self.session.commit()
            return True
        return False