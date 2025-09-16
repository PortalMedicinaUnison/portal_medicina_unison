from fastapi import APIRouter, Depends, HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from typing import List
from schemas.internship import (
    InternshipInput, InternshipUpdate, InternshipOutput,
    InternshipApplicationInput, InternshipApplicationUpdate, InternshipApplicationOutput,
    InternshipDocumentInput, InternshipDocumentUpdate, InternshipDocumentOutput
)
from core.dependencies import get_db
from controllers.internship import (
    create_internship,
    get_internship,
    get_all_internships,
    get_internships_by_student,
    get_internships_by_site,
    update_internship,
    delete_internship,

    create_internship_application,
    get_all_internship_applications,
    get_internship_applications_by_student,
    get_internship_applications_by_status,
    update_internship_application, 
    delete_internship_application, 
    create_internship_document,
    get_all_internship_documents,
    get_internship_documents_by_internship,
    get_internship_documents_by_id,
    update_internship_document,
    delete_internship_document
)

# ----------------------  Internship  ----------------------

internship_router = APIRouter(prefix="/internships", tags=["Internados"])

@internship_router.post('/', response_model=InternshipInput)
async def create_internship_route(internship: InternshipInput, db: Session = Depends(get_db)):
    internship = create_internship(internship, db)
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el internado")
    return internship

@internship_router.get('/', response_model=List[InternshipOutput])
async def get_internships_route(db: Session = Depends(get_db)):
    internships = get_all_internships(db)
    return internships

@internship_router.get('/{internship_id}', response_model=InternshipOutput)
async def get_internship_route(internship_id: int, db: Session = Depends(get_db)):
    internship = get_internship(internship_id, db)
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internship

@internship_router.get('/{student_id}', response_model=List[InternshipOutput])
async def get_internships_by_student_route(student_id: int, db: Session = Depends(get_db)):
    internships = get_internships_by_student(student_id, db)
    if not internships:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internships

@internship_router.get('/{site_id}', response_model=List[InternshipOutput])
async def get_internships_by_site_route(site_id: int, db: Session = Depends(get_db)):
    internships = get_internships_by_site(site_id, db)
    if not internships:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internships

@internship_router.patch('/{internship_id}', response_model=InternshipUpdate)
async def update_internship_route(internship_id: int, internship: InternshipInput, db: Session = Depends(get_db)):
    internship = update_internship(internship_id, internship, db)
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internship

@internship_router.delete('/{internship_id}')
async def delete_internship_route(internship_id: int, db: Session = Depends(get_db)):
    internship = delete_internship(internship_id, db)
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return internship

# ----------------------  Internship enrollments  ----------------------

internship_application_router = APIRouter(prefix="/internship/applications", tags=["Internship Applications"])

@internship_application_router.post('/', response_model=InternshipApplicationInput)
async def create_internship_application_route(internship_application: InternshipApplicationInput, db: Session = Depends(get_db)):
    application = create_internship_application(internship_application, db)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear la aplicación al internado")
    return application

@internship_application_router.get('/', response_model=List[InternshipApplicationOutput])
async def get_all_internship_applications_route(db: Session = Depends(get_db)):
    applications = get_all_internship_applications(db)
    return applications

@internship_application_router.get('/{student_id}', response_model=List[InternshipApplicationOutput])
async def get_internship_applications_by_student_route(student_id: int, db: Session = Depends(get_db)):
    applications = get_internship_applications_by_student(student_id, db)
    if not applications:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación al internado no encontrada")
    return applications

@internship_application_router.get('/by-status/', response_model=List[InternshipApplicationOutput])
async def get_internship_applications_by_status_route(is_accepted: bool, db: Session = Depends(get_db)):
    applications = get_internship_applications_by_status(is_accepted, db)
    if not applications:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación al internado no encontrada")
    return applications

@internship_application_router.patch('/{application_id}', response_model=InternshipApplicationUpdate)
async def update_internship_application_route(application_id: int, application: InternshipApplicationInput, db: Session = Depends(get_db)):
    updated_application = update_internship_application(application_id, application, db)
    if not updated_application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación no encontrada")
    return updated_application

@internship_application_router.delete('/{application_id}')
async def delete_internship_application_route(application_id: int, db: Session = Depends(get_db)):
    deleted = delete_internship_application(application_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación no encontrada")
    return deleted

# ----------------------  Internship documents  ----------------------

internship_document_router = APIRouter(prefix="/internship/documents", tags=["Documentos"])

@internship_document_router.post('/', response_model=InternshipDocumentInput)
async def create_internship_document_route(internship_document: InternshipDocumentInput, db: Session = Depends(get_db)):
    internship_document = create_internship_document(internship_document, db)
    if not internship_document:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el documento del internado")
    return internship_document

@internship_document_router.get('/', response_model=List[InternshipDocumentOutput])
async def get_internship_documents_route(db: Session = Depends(get_db)):
    internship_documents = get_all_internship_documents(db)
    return internship_documents

@internship_document_router.get('/{internship_id}', response_model=List[InternshipDocumentOutput])
async def get_internship_documents_by_internship_route(internship_id: int, db: Session = Depends(get_db)):
    internship_documents = get_internship_documents_by_internship(internship_id, db)
    if not internship_documents:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron documentos de internados")
    return internship_documents

@internship_document_router.get('/{document_id}', response_model=InternshipDocumentOutput)
async def get_internship_documents_by_id_route(document_id: int, db: Session = Depends(get_db)):
    internship_document = get_internship_documents_by_id(document_id, db)
    if not internship_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento de internado no encontrado")
    return internship_document

@internship_document_router.patch('/{document_id}', response_model=InternshipDocumentUpdate)
async def update_internship_document_route(document_id: int, document: InternshipDocumentInput, db: Session = Depends(get_db)):
    document = update_internship_document(document_id, document, db)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento de internado no encontrado")
    return document

@internship_document_router.delete('/{document_id}')
async def delete_internship_document_route(document_id: int, db: Session = Depends(get_db)):
    document = delete_internship_document(document_id, db)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento de internado no encontrado")
    return document
