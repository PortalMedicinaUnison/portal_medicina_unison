from .base import BaseRepo
from models.internship import  InternshipEnrollment, Internship, InternshipDocument
from typing import List, Optional


class InternshipRepo(BaseRepo):

    def create(self, data: Internship) -> Internship:
        """ Crea una nueva pasantía en la base de datos. """
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_by_id(self, internship_id: int) -> Internship:
        """ Obtiene una pasantía por su ID. """
        return self.session.query(Internship).filter(
            Internship.internship_id == internship_id,
            Internship.is_active == True
        ).first()

    def get_by_student_id(self, student_id: int) -> List[Internship]:
        """ Obtiene todas las pasantías asociadas a un estudiante. """
        return self.session.query(Internship).filter(
            Internship.student_id == student_id,
            Internship.is_active == True
        ).all()

    def get_by_site_id(self, site_id: int) -> List[Internship]:
        """ Obtiene todas las pasantías asociadas a un sitio. """
        return self.session.query(Internship).filter(
            Internship.site_id == site_id,
            Internship.is_active == True
        ).all()

    def update(self, internship_id: int, data: dict) -> Internship:
        """ Actualiza los datos de una pasantía. """
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

# ---------------  INTERNSHIP ENROLLMENT  ----------------------

class InternshipEnrollmentRepo(BaseRepo):

    def create(self, data: InternshipEnrollment) -> InternshipEnrollment:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_by_id(self, enrollment_id: int) -> Optional[InternshipEnrollment]:
        return (self.session.query(InternshipEnrollment).filter(
            InternshipEnrollment.enrollment_id == enrollment_id,
            InternshipEnrollment.is_active == True
        ).first())

    def get_by_student_id(self, student_id: int) -> List[InternshipEnrollment]:
        return self.session.query(InternshipEnrollment).filter(
            InternshipEnrollment.student_id == student_id,
            InternshipEnrollment.is_active == True
        ).all()

    def get_by_status(self, is_accepted: bool) -> List[InternshipEnrollment]:
        return self.session.query(InternshipEnrollment).filter(
            InternshipEnrollment.is_accepted == is_accepted,
            InternshipEnrollment.is_active == True
        ).all()
    
    def get_all(self) -> List[InternshipEnrollment]:
        return self.session.query(InternshipEnrollment).filter(
            InternshipEnrollment.is_active == True
        ).all()
    
    def update(self, enrollment_id: int, data: dict) -> Optional[InternshipEnrollment]:
        enrollment = self.get_by_id(enrollment_id)
        if enrollment:
            for k, v in data.items():
                if hasattr(enrollment, k):
                    setattr(enrollment, k, v)
            self.session.commit()
            self.session.refresh(enrollment)
        return enrollment

    def delete(self, enrollment_id: int) -> bool:
        enrollment = self.get_by_id(enrollment_id)
        if enrollment:
            enrollment.is_active = False
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

    def get_by_id(self, document_id: int) -> Optional[InternshipDocument]:
        return (self.session.query(InternshipDocument).filter(
            InternshipDocument.document_id == document_id,
            InternshipDocument.is_active == True
        ).first())

    def get_by_internship(self, internship_id: int) -> List[InternshipDocument]:
        return (self.session.query(InternshipDocument).filter(
            InternshipDocument.internship_id == internship_id,
            InternshipDocument.is_active == True
        ).all())

    def update(self, document_id: int, data: dict) -> Optional[InternshipDocument]:
        doc = self.get_by_id(document_id)
        if doc:
            for k, v in data.items():
                if hasattr(doc, k):
                    setattr(doc, k, v)
            self.session.commit()
            self.session.refresh(doc)
        return doc

    def delete(self, document_id: int) -> bool:
        doc = self.get_by_id(document_id)
        if doc:
            doc.is_active = False
            self.session.commit()
            return True
        return False