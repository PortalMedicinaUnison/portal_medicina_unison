import os
import shutil
from datetime import datetime
from fastapi import UploadFile
from .base import BaseRepo
from models.report import Report


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