from .base import BaseRepo
from models.communication import Announcement, Survey, Report, AnnouncementTypeEnum, ReportTypeEnum

class AnnouncementRepo(BaseRepo):
    
    def create(self, data: Announcement) -> Announcement:
        """Crea un nuevo anuncio en la base de datos."""
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_by_id(self, announcement_id: int) -> Announcement:
        """Obtiene un anuncio por su ID."""
        return self.session.query(Announcement).filter(Announcement.announcement_id == announcement_id).first()
    
    def get_by_type(self, announcement_type: AnnouncementTypeEnum):
        """Obtiene anuncios por su tipo."""
        return self.session.query(Announcement).filter(Announcement.announcement_type == announcement_type).all()
    
    def update(self, announcement_id: int, data: dict) -> Announcement:
        """Actualiza los datos de un anuncio."""
        announcement = self.get_by_id(announcement_id)
        if announcement:
            data = data.dict(exclude_unset=True)
            for key, value in data.items():
                if hasattr(announcement, key):
                    setattr(announcement, key, value)
            self.session.commit()
            self.session.refresh(announcement)
        return announcement
    
    def delete(self, announcement_id: int) -> bool:
        """Elimina un anuncio por su ID."""
        announcement = self.get_by_id(announcement_id)
        if announcement:
            self.session.delete(announcement)
            self.session.commit()
            return True
        return False


class SurveyRepo(BaseRepo):
    
    def create(self, data: Survey) -> Survey:
        """Crea una nueva encuesta en la base de datos."""
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_by_id(self, survey_id: int) -> Survey:
        """Obtiene una encuesta por su ID."""
        return self.session.query(Survey).filter(Survey.survey_id == survey_id).first()
    
    def get_by_mandatory(self, mandatory: bool):
        """Obtiene encuestas según si son obligatorias o no."""
        return self.session.query(Survey).filter(Survey.mandatory == mandatory).all()
    
    def update(self, survey_id: int, data: dict) -> Survey:
        """Actualiza los datos de una encuesta."""
        survey = self.get_by_id(survey_id)
        if survey:
            for key, value in data.items():
                if hasattr(survey, key):
                    setattr(survey, key, value)
            self.session.commit()
            self.session.refresh(survey)
        return survey
    
    def delete(self, survey_id: int) -> bool:
        """Elimina una encuesta por su ID."""
        survey = self.get_by_id(survey_id)
        if survey:
            self.session.delete(survey)
            self.session.commit()
            return True
        return False


class ReportRepo(BaseRepo):
    
    def create(self, data: Report) -> Report:
        """Crea un nuevo reporte en la base de datos."""
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_by_id(self, report_id: int) -> Report:
        """Obtiene un reporte por su ID."""
        return self.session.query(Report).filter(Report.report_id == report_id).first()
    
    def get_by_mandatory(self, mandatory: bool):
        """Obtiene reportes según si son obligatorios o no."""
        return self.session.query(Report).filter(Report.anonymity == mandatory).all()
    
    def update(self, report_id: int, data: dict) -> Report:
        """Actualiza los datos de un reporte."""
        report = self.get_by_id(report_id)
        if report:
            data = data.dict(exclude_unset=True)
            for key, value in data.items():
                if hasattr(report, key):
                    setattr(report, key, value)
            self.session.commit()
            self.session.refresh(report)
        return report
    
    def delete(self, report_id: int) -> bool:
        """Elimina un reporte por su ID."""
        report = self.get_by_id(report_id)
        if report:
            self.session.delete(report)
            self.session.commit()
            return True
        return False
