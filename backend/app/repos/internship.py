from .base import BaseRepo
from models.internship import  InternshipEnrollment, Internship, InternshipDocument

class InternshipRepo(BaseRepo):

    def create(self, data: Internship) -> Internship:
        """ Crea una nueva pasantía en la base de datos. """
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_by_id(self, internship_id: int) -> Internship:
        """ Obtiene una pasantía por su ID. """
        return self.session.query(Internship).filter(Internship.internship_id == internship_id).first()

    def get_by_student_id(self, student_id: int):
        """ Obtiene todas las pasantías asociadas a un estudiante. """
        return self.session.query(Internship).filter(Internship.student_id == student_id).all()

    def get_by_site_id(self, site_id: int):
        """ Obtiene todas las pasantías asociadas a un sitio. """
        return self.session.query(Internship).filter(Internship.site_id == site_id).all()

    def update(self, internship_id: int, data: dict) -> Internship:
        """ Actualiza los datos de una pasantía. """
        internship = self.get_by_id(internship_id)
        if internship:
            data = data.dict(exclude_unset=True)
            for key, value in data.items():
                if hasattr(internship, key):
                    setattr(internship, key, value)
            self.session.commit()
            self.session.refresh(internship)
        return internship


class InternshipEnrollmentRepo(BaseRepo):

    def create(self, data: InternshipEnrollment) -> InternshipEnrollment:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_by_student_id(self, student_id: int):
        return self.session.query(InternshipEnrollment).filter_by(student_id=student_id).all()

    def get_by_status(self, is_accepted: bool):
        return self.session.query(InternshipEnrollment).filter_by(is_accepted=is_accepted).all()
