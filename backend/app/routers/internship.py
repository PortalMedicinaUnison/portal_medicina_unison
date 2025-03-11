from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.internship import InternshipInput, InternshipEnrollmentInput
from core.dependencies import get_db
from controllers.internship import (
    create_internship, update_internship, read_internships_by_site, read_internships_by_student, read_single_internship,
    create_internship_enrollment, read_internship_enrollments_by_status, read_internship_enrollments_by_student
)

# ---------------  Internship  ----------------------

internship_router = APIRouter(prefix="/internships", tags=["Internados"])

@internship_router.post('/', response_model=InternshipInput)
async def create_internship_route(internship: InternshipInput, db: Session = Depends(get_db)):
    internship = create_internship(internship, db)
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el internado")
    return internship

@internship_router.get('/{internship_id}', response_model=InternshipInput)
async def read_internship_route(internship_id: int, db: Session = Depends(get_db)):
    internship = read_single_internship(internship_id, db)
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internship

@internship_router.get('/{student_id}', response_model=List[InternshipInput])
async def read_internships_by_student_route(student_id: int, db: Session = Depends(get_db)):
    internships = read_internships_by_student(student_id, db)
    if not internships:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internships

@internship_router.get('/{site_id}', response_model=List[InternshipInput])
async def read_internships_by_site_route(site_id: int, db: Session = Depends(get_db)):
    internships = read_internships_by_site(site_id, db)
    if not internships:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internships

@internship_router.patch('/{internship_id}', response_model=InternshipInput)
async def update_internship_route(internship_id: int, internship: InternshipInput, db: Session = Depends(get_db)):
    internship = update_internship(internship_id, internship, db)
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internship

# ---------------  Internship enrollments  ----------------------

internship_enrollment_router = APIRouter(prefix="/internship_enrollments", tags=["Inscripciones"])

@internship_enrollment_router.post('/', response_model=InternshipEnrollmentInput)
async def create_internship_enrollment_route(internship_enrollment: InternshipEnrollmentInput, db: Session = Depends(get_db)):
    internship_enrollment = create_internship_enrollment(internship_enrollment, db)
    if not internship_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear la inscripción al internado")
    return internship_enrollment

@internship_enrollment_router.get('/{student_id}', response_model=List[InternshipEnrollmentInput])
async def read_internship_enrollments_by_student_route(student_id: int, db: Session = Depends(get_db)):
    internship_enrollments = read_internship_enrollments_by_student(student_id, db)
    if not internship_enrollments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inscripción a internado no encontrada")
    return internship_enrollments

@internship_enrollment_router.get('/', response_model=List[InternshipEnrollmentInput])
async def read_internship_enrollment_by_status_route(is_accepted: bool, db: Session = Depends(get_db)):
    internship_enrollments = read_internship_enrollments_by_status(is_accepted, db)
    if not internship_enrollments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inscripción a internado no encontrada")
    return internship_enrollments