from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.dependencies import get_db
from typing import List
from schemas.internship import (
    InternshipInput, InternshipUpdate, InternshipOutput,
    InternshipApplicationInput, InternshipApplicationUpdate, InternshipApplicationOutput,
    InternshipDocumentInput, InternshipDocumentUpdate, InternshipDocumentOutput
)
from controllers.internship import (
    create_internship,
    get_all_internships,
    get_internship,
    get_internships_by_academic,
    get_internships_by_site,
    update_internship,
    delete_internship,

    create_internship_application,
    get_all_internship_applications,
    get_internship_application,
    get_internship_applications_by_academic,
    get_internship_applications_pending_by_academic,
    get_internship_application_for_update,
    update_internship_application, 
    delete_internship_application, 

    create_internship_document,
    get_all_internship_documents,
    get_internship_documents_by_id,
    update_internship_document,
    delete_internship_document
)

# ----------------------  INTERNSHIP  ----------------------

internship_router = APIRouter(prefix="/internships", tags=["Internados"])

@internship_router.post('/', response_model=InternshipOutput)
async def create_internship_route(internship: InternshipInput, db: Session = Depends(get_db)):
    created_internship = create_internship(internship, db)
    if not created_internship:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el internado")
    return created_internship

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

@internship_router.get('/academicId/{academic_id}', response_model=List[InternshipOutput])
async def get_internships_by_academic_route(academic_id: int, db: Session = Depends(get_db)):
    internships = get_internships_by_academic(academic_id, db)
    return internships

@internship_router.get('/siteId/{site_id}', response_model=List[InternshipOutput])
async def get_internships_by_site_route(site_id: int, db: Session = Depends(get_db)):
    internships = get_internships_by_site(site_id, db)
    return internships

@internship_router.patch('/{internship_id}', response_model=InternshipOutput)
async def update_internship_route(internship_id: int, internship: InternshipUpdate, db: Session = Depends(get_db)):
    updated_internship = update_internship(internship_id, internship, db)
    if not updated_internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return updated_internship

@internship_router.delete('/{internship_id}')
async def delete_internship_route(internship_id: int, db: Session = Depends(get_db)):
    deleted = delete_internship(internship_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internado no encontrado")
    return deleted

# ----------------------  INTERNSHIP APPLICATION  ----------------------

internship_application_router = APIRouter(prefix="/internship-applications", tags=["Internship Applications"])

@internship_application_router.post('/', response_model=InternshipApplicationOutput)
async def create_internship_application_route(internship_application: InternshipApplicationInput, db: Session = Depends(get_db)):
    created_application = create_internship_application(internship_application, db)
    if not created_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear la aplicación al internado")
    return created_application

@internship_application_router.get('/', response_model=List[InternshipApplicationOutput])
async def get_all_internship_applications_route(db: Session = Depends(get_db)):
    applications = get_all_internship_applications(db)
    return applications

@internship_application_router.get('/{application_id}', response_model=InternshipApplicationOutput)
async def get_internship_application_route(application_id: int, db: Session = Depends(get_db)):
    application = get_internship_application(application_id, db)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación no encontrada")
    return application

@internship_application_router.get('/academicId/{academic_id}', response_model=List[InternshipApplicationOutput])
async def get_internship_applications_by_academic_route(academic_id: int, db: Session = Depends(get_db)):
    applications = get_internship_applications_by_academic(academic_id, db)
    return applications

@internship_application_router.get('/academicId/{academic_id}/pending', response_model=InternshipApplicationOutput)
async def get_internship_applications_pending_by_academic_route(academic_id: int, db: Session = Depends(get_db)):
    applications = get_internship_applications_pending_by_academic(academic_id, db)
    return applications

@internship_application_router.get('/{application_id}/for-update', response_model=InternshipApplicationOutput)
async def get_internship_application_for_update_route(application_id: int, db: Session = Depends(get_db)):
    application = get_internship_application_for_update(application_id, db)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación no encontrada")
    return application

@internship_application_router.patch('/{application_id}', response_model=InternshipApplicationOutput)
async def update_internship_application_route(application_id: int, application: InternshipApplicationUpdate, db: Session = Depends(get_db)):
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

# ----------------------  INTERNSHIP DOCUMENT  ----------------------

internship_document_router = APIRouter(prefix="/internships", tags=["Documentos"])

@internship_document_router.post('/{internship_id}/documents', response_model=InternshipDocumentOutput)
async def create_internship_document_route(internship_id: int, internship_document: InternshipDocumentInput, db: Session = Depends(get_db)):
    created_internship_document = create_internship_document(internship_id, internship_document, db)
    if not created_internship_document:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se pudo crear el documento del internado")
    return created_internship_document

@internship_document_router.get('/{internship_id}/documents', response_model=List[InternshipDocumentOutput])
async def get_internship_documents_route(internship_id: int, db: Session = Depends(get_db)):
    internship_documents = get_all_internship_documents(internship_id, db)
    return internship_documents

@internship_document_router.get('/{internship_id}/documents/{document_id}', response_model=InternshipDocumentOutput)
async def get_internship_documents_by_id_route(internship_id: int, document_id: int, db: Session = Depends(get_db)):
    internship_document = get_internship_documents_by_id(internship_id, document_id, db)
    if not internship_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento de internado no encontrado")
    return internship_document

@internship_document_router.patch('/{internship_id}/documents/{document_id}', response_model=InternshipDocumentOutput)
async def update_internship_document_route(internship_id: int, document_id: int, document: InternshipDocumentUpdate, db: Session = Depends(get_db)):
    updated_document = update_internship_document(internship_id, document_id, document, db)
    if not updated_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento de internado no encontrado")
    return updated_document

@internship_document_router.delete('/{internship_id}/documents/{document_id}')
async def delete_internship_document_route(internship_id: int, document_id: int, db: Session = Depends(get_db)):
    deleted = delete_internship_document(internship_id, document_id, db)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento de internado no encontrado")
    return deleted