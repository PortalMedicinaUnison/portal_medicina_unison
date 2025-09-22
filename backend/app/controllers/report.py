import os
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from repos.report import ReportRepo
from models.report import Report
from schemas.report import ReportInput, ReportInputUpdate
from utils.utils import orm_to_dict, map_to_model


def create_report(report: ReportInput, db: Session):
    new_report = map_to_model(report, Report)
    report_repo = ReportRepo(db)    
    created_report = report_repo.create(new_report)
    report_response = orm_to_dict(created_report)
    return report_response

def get_all_reports(db: Session):
    report_repo = ReportRepo(db)
    reports = report_repo.get_all()
    if not reports:
        return []
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response

def get_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    report = report_repo.get_by_id(report_id)
    if not report:
        return None
    report_response = orm_to_dict(report)
    return report_response

def get_reports_by_student(student_id: int, db: Session):
    report_repo = ReportRepo(db)
    reports = report_repo.get_by_student_id(student_id)
    if not reports:
        return []
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response

def get_reports_by_internship(internship_id: int, db: Session):
    report_repo = ReportRepo(db)
    reports = report_repo.get_by_internship_id(internship_id)
    if not reports:
        return []
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response

def get_reports_by_site(site_id: int, db: Session):
    report_repo = ReportRepo(db)
    reports = report_repo.get_by_site_id(site_id)
    if not reports:
        return []
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response

def update_report(report_id: int, report_input: ReportInputUpdate, db: Session):
    update_data = report_input.dict(exclude_unset=True)
    report_repo = ReportRepo(db)
    updated_report = report_repo.update(report_id, update_data)
    if not updated_report:
        return None
    report_response = orm_to_dict(updated_report)
    return report_response

def delete_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    return report_repo.delete(report_id)

def upload_evidence_file(report_id: int, student_id: int, file: UploadFile, db: Session):
    """Subir un archivo de evidencia para un reporte"""
    report_repo = ReportRepo(db)
    existing_report = report_repo.get_by_id(report_id)
    if not existing_report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reporte no encontrado")
    if existing_report.student_id != student_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para modificar este reporte")
    
    # Validar tamaño del archivo (máximo 50MB)
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    max_size = 50 * 1024 * 1024  # 50MB en bytes
    if file_size > max_size:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="El archivo es demasiado grande. El tamaño máximo permitido es de 50MB.")
    
    file_path = report_repo.upload_evidence(report_id, file)
    if not file_path:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al subir el archivo de evidencia")
    
    updated_report = report_repo.get_by_id(report_id)
    report_response = orm_to_dict(updated_report)
    return report_response