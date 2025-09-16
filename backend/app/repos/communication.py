import os
import shutil
from datetime import datetime
from fastapi import UploadFile
from .base import BaseRepo
from models.communication import Announcement, Survey, Report, AnnouncementTypeEnum, ReportTypeEnum

class AnnouncementRepo(BaseRepo):
    def create(self, data: Announcement) -> Announcement:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_all(self) -> list[Announcement]:
        return self.session.query(Announcement).filter(
            Announcement.is_active == True
        ).all()

    def get_by_id(self, announcement_id: int) -> Announcement:
        return self.session.query(Announcement).filter(
            Announcement.announcement_id == announcement_id,
            Announcement.is_active == True,
        ).first()
    
    def get_by_type(self, announcement_type: AnnouncementTypeEnum):
        return self.session.query(Announcement).filter(
            Announcement.announcement_type == announcement_type,
            Announcement.is_active == True
        ).all()

    def update(self, announcement_id: int, data: dict) -> Announcement:
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
        announcement = self.get_by_id(announcement_id)
        if announcement:
            announcement.is_active = False
            self.session.commit()
            return True
        return False


class SurveyRepo(BaseRepo):
    def create(self, data: Survey) -> Survey:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> list[Survey]:
        return self.session.query(Survey).filter(
            Survey.is_active == True
        ).all()

    def get_by_id(self, survey_id: int) -> Survey:
        return self.session.query(Survey).filter(
            Survey.survey_id == survey_id,
            Survey.is_active == True,
        ).first()
    
    def get_by_mandatory(self, mandatory: bool):
        return self.session.query(Survey).filter(
            Survey.mandatory == mandatory,
            Survey.is_active == True
        ).all()
    
    def update(self, survey_id: int, data: dict) -> Survey:
        survey = self.get_by_id(survey_id)
        if survey:
            for key, value in data.items():
                if hasattr(survey, key):
                    setattr(survey, key, value)
            self.session.commit()
            self.session.refresh(survey)
        return survey
    
    def delete(self, survey_id: int) -> bool:
        survey = self.get_by_id(survey_id)
        if survey:
            self.session.delete(survey)
            self.session.commit()
            return True
        return False

class ReportRepo(BaseRepo):    
    def create(self, data: Report) -> Report:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> list[Report]:
        return self.session.query(Report).filter(
            Report.is_active == True
        ).all()
    
    def get_by_id(self, report_id: int) -> Report:
        return self.session.query(Report).filter(
            Report.report_id == report_id,
            Report.is_active == True,
        ).first()
    
    def get_by_student_id(self, student_id: int):
        """Los estudiantes pueden ver todos sus reportes, incluso los inactivos"""
        return self.session.query(Report).filter(
            Report.student_id == student_id
        ).all()
    
    def get_by_internship_id(self, internship_id: int):
        return self.session.query(Report).filter(
            Report.internship_id == internship_id,
            Report.is_active == True
        ).all()
    
    def get_by_site_id(self, site_id: int):
        return self.session.query(Report).filter(
            Report.site_id == site_id,
            Report.is_active == True
        ).all()
    
    def get_by_mandatory(self, mandatory: bool):
        return self.session.query(Report).filter(
            Report.mandatory == mandatory,
            Report.is_active == True
        ).all()
    
    def update(self, report_id: int, data: dict) -> Report:
        report = self.get_by_id(report_id)
        if report:
            for key, value in data.items():
                if hasattr(report, key):
                    setattr(report, key, value)
            self.session.commit()
            self.session.refresh(report)
        return report
    
    def delete(self, report_id: int) -> bool:
        report = self.get_by_id(report_id)
        if report:
            report.is_active = False
            self.session.commit()
            return True
        return False

    def update_admin_comment(self, report_id: int, admin_comment: str, close_report: bool = False) -> Report:
        """Actualizar el comentario del administrador en un reporte"""
        report = self.get_by_id(report_id)
        if report:
            report.admin_comment = admin_comment
            if close_report:
                report.is_open = False  # Solo marcar como cerrado si se solicita
            self.session.commit()
            self.session.refresh(report)
        return report
    
    def toggle_status(self, report_id: int) -> Report:
        """Cambiar el estado activo/inactivo de un reporte"""
        report = self.get_by_id(report_id)
        if report:
            report.is_active = not report.is_active
            self.session.commit()
            self.session.refresh(report)
        return report
    
    def get_open_reports(self):
        """Obtener todos los reportes abiertos (sin comentario del admin)"""
        return self.session.query(Report).filter(
            Report.is_open == True,
            Report.is_active == True
        ).all()
    
    def get_closed_reports(self):
        """Obtener todos los reportes cerrados (con comentario del admin)"""
        return self.session.query(Report).filter(
            Report.is_open == False,
            Report.is_active == True
        ).all()

    def upload_evidence(self, report_id: int, file: UploadFile) -> str:
        report = self.get_by_id(report_id)
        if not report:
            return None
        
        # Crear directorio para el reporte si no existe
        evidence_dir = os.path.join("app", "evidence_files", str(report_id))
        os.makedirs(evidence_dir, exist_ok=True)
        
        # Generar nombre único para el archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(evidence_dir, filename)
        
        # Guardar el archivo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Guardar la ruta relativa en el reporte
        relative_path = os.path.join("evidence_files", str(report_id), filename)
        report.evidence = relative_path
        self.session.commit()
        
        return relative_path