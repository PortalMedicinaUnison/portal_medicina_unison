from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from core.dependencies import get_db
from typing import List
from schemas.report import ReportInput, ReportInputUpdate, ReportOutput
from controllers.report import (
    create_report,
    get_all_reports,
    get_report,
    get_reports_by_student,
    get_reports_by_internship,
    get_reports_by_site,
    update_report,
    delete_report,
    upload_evidence_file
)

# ----------------------  REPORT  ----------------------

report_router = APIRouter(prefix="/reports", tags=["Reportes"])

@report_router.post('/', response_model=ReportOutput)
async def create_report_route(student_id: int, report: ReportInput, db: Session = Depends(get_db)):
    report = create_report(report, student_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el reporte")
    return report

@report_router.get('/', response_model=List[ReportOutput])
async def get_reports_route(db: Session = Depends(get_db)):
    reports = get_all_reports(db)
    return reports

@report_router.get('/{report_id}', response_model=ReportOutput)
async def get_report_route(report_id: int, student_id: int, db: Session = Depends(get_db)):
    report = get_report(report_id, student_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

@report_router.get('/studentId/{student_id}', response_model=List[ReportOutput])
async def get_reports_by_student_route(student_id: int, db: Session = Depends(get_db)):
    reports = get_reports_by_student(student_id, db)
    return reports

@report_router.get('/internshipId/{internship_id}', response_model=List[ReportOutput])
async def get_reports_by_internship_route(internship_id: int, db: Session = Depends(get_db)):
    reports = get_reports_by_internship(internship_id, db)
    return reports

@report_router.get('/siteId/{site_id}', response_model=List[ReportOutput])
async def get_reports_by_site_route(site_id: int, db: Session = Depends(get_db)):
    reports = get_reports_by_site(site_id, db)
    return reports

@report_router.patch('/{report_id}', response_model=ReportOutput)
async def update_report_route(report_id: int, report_update: ReportInputUpdate, student_id: int, db: Session = Depends(get_db)):
    report = update_report(report_id, report_update, student_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

@report_router.post('/{report_id}/evidence', response_model=ReportOutput)
async def upload_evidence_route(report_id: int, student_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    report = upload_evidence_file(report_id, student_id, file, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado")
    return report

@report_router.post("/{report_id}")
def delete_report_router(report_id: int, db: Session = Depends(get_db)):
    deleted = delete_report(report_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no econtrado")
    return deleted    
        