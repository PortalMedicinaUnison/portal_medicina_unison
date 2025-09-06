import os
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from repos.communication import ReportRepo
from models.communication import Report
from schemas.report import ReportInput, ReportInputUpdate, ReportStatusUpdate
from utils.utils import orm_to_dict
from datetime import datetime


def create_report(report: ReportInput, student_id: int, db: Session):
    """Crear un nuevo reporte"""
    report_repo = ReportRepo(db)
    
    # Crear el modelo ORM
    new_report = Report(
        student_id=student_id,
        internship_id=report.internship_id,
        site_id=report.site_id,
        date_report=report.date_report,
        report_type=report.report_type,
        other_type=report.other_type,
        description=report.description,
        evidence=report.evidence,
        anonymity=report.anonymity,
        is_open=True,
        admin_comment="Aun no hay comentarios",  # Valor por defecto
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    # Validar que el estudiante tenga acceso a la pasantía y sitio especificados
    # (Esta validación se puede implementar más adelante cuando se tenga el contexto completo)
    
    created_report = report_repo.create(new_report)
    report_response = orm_to_dict(created_report)
    return report_response


def get_report(report_id: int, student_id: int, db: Session):
    """Obtener un reporte específico del estudiante"""
    report_repo = ReportRepo(db)
    report = report_repo.get_by_id(report_id)



    """REVISAR ESTO. ES DIFERENTE A SITES"""
    """REVISAR ESTO. ES DIFERENTE A SITES"""
    """REVISAR ESTO. ES DIFERENTE A SITES"""
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    # Validar que el estudiante solo pueda ver sus propios reportes
    if report.student_id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para ver este reporte"
        )
    
    report_response = orm_to_dict(report)
    return report_response


def get_all_student_reports(student_id: int, db: Session):
    """Obtener todos los reportes del estudiante"""
    report_repo = ReportRepo(db)
    reports = report_repo.get_by_student_id(student_id)
    
    if not reports:
        return []
    
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response


def update_report(report_id: int, report_input: ReportInputUpdate, student_id: int, db: Session):
    """Actualizar un reporte existente del estudiante"""
    report_repo = ReportRepo(db)
    
    # Verificar que el reporte existe y pertenece al estudiante
    existing_report = report_repo.get_by_id(report_id)
    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    if existing_report.student_id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar este reporte"
        )
    
    # Solo permitir actualizar campos específicos
    update_data = report_input.dict(exclude_unset=True)
    
    # Validar que no se estén modificando campos restringidos
    restricted_fields = ['description', 'anonymity', 'internship_id', 'site_id', 'date_report', 'report_type']
    for field in restricted_fields:
        if field in update_data:
            del update_data[field]
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay campos válidos para actualizar"
        )
    
    # Agregar timestamp de actualización
    update_data['updated_at'] = datetime.utcnow()
    
    updated_report = report_repo.update(report_id, update_data)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el reporte"
        )
    
    report_response = orm_to_dict(updated_report)
    return report_response


def toggle_report_status(report_id: int, student_id: int, db: Session):
    """Cambiar el estado activo/inactivo de un reporte"""
    report_repo = ReportRepo(db)
    
    # Verificar que el reporte existe y pertenece al estudiante
    existing_report = report_repo.get_by_id(report_id)
    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    if existing_report.student_id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para modificar este reporte"
        )
    
    updated_report = report_repo.toggle_status(report_id)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al cambiar el estado del reporte"
        )
    
    report_response = orm_to_dict(updated_report)
    return report_response


def get_report_by_internship(internship_id: int, student_id: int, db: Session):
    """Obtener reportes de una pasantía específica del estudiante"""
    report_repo = ReportRepo(db)
    
    # Obtener todos los reportes de la pasantía
    all_reports = report_repo.get_by_internship_id(internship_id)
    
    # Filtrar solo los del estudiante
    student_reports = [report for report in all_reports if report.student_id == student_id]
    
    if not student_reports:
        return []
    
    reports_response = [orm_to_dict(report) for report in student_reports]
    return reports_response


def get_report_by_site(site_id: int, student_id: int, db: Session):
    """Obtener reportes de un sitio específico del estudiante"""
    report_repo = ReportRepo(db)
    
    # Obtener todos los reportes del sitio
    all_reports = report_repo.get_by_site_id(site_id)
    
    # Filtrar solo los del estudiante
    student_reports = [report for report in all_reports if report.student_id == student_id]
    
    if not student_reports:
        return []
    
    reports_response = [orm_to_dict(report) for report in student_reports]
    return reports_response


# Funciones para administradores (se implementarán más adelante)
def get_report_admin(report_id: int, db: Session):
    """Obtener un reporte específico (solo para administradores)"""
    report_repo = ReportRepo(db)
    report = report_repo.get_by_id(report_id)
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    report_response = orm_to_dict(report)
    return report_response


def update_report_admin(report_id: int, data: dict, db: Session):
    """Actualizar un reporte específico (solo para administradores)"""
    report_repo = ReportRepo(db)
    
    # Verificar que el reporte existe
    existing_report = report_repo.get_by_id(report_id)
    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    # Actualizar el reporte
    updated_report = report_repo.update(report_id, data)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el reporte"
        )
    
    report_response = orm_to_dict(updated_report)
    return report_response


def get_all_reports_admin(db: Session):
    """Obtener todos los reportes (solo para administradores)"""
    report_repo = ReportRepo(db)
    reports = report_repo.get_all()
    
    if not reports:
        return []
    
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response


def get_open_reports_admin(db: Session):
    """Obtener reportes abiertos (solo para administradores)"""
    report_repo = ReportRepo(db)
    reports = report_repo.get_open_reports()
    
    if not reports:
        return []
    
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response


def get_closed_reports_admin(db: Session):
    """Obtener reportes cerrados (solo para administradores)"""
    report_repo = ReportRepo(db)
    reports = report_repo.get_closed_reports()
    
    if not reports:
        return []
    
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response


def add_admin_comment(report_id: int, admin_comment: str, db: Session, close_report: bool = False):
    """Agregar comentario del administrador (solo para administradores)"""
    report_repo = ReportRepo(db)
    
    # Verificar que el reporte existe
    existing_report = report_repo.get_by_id(report_id)
    if not existing_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    updated_report = report_repo.update_admin_comment(report_id, admin_comment, close_report)
    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al agregar el comentario del administrador"
        )
    
    report_response = orm_to_dict(updated_report)
    return report_response


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
