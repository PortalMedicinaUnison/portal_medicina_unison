from sqlalchemy.orm import Session
from models.internship import Internship, InternshipApplication, InternshipDocument
from repos.internship import InternshipRepo, InternshipApplicationRepo, InternshipDocumentRepo
from schemas.internship import (
    InternshipInput, InternshipUpdate,
    InternshipApplicationInput, InternshipApplicationUpdate, 
    InternshipDocumentInput, InternshipDocumentUpdate,
)
from utils.utils import orm_to_dict, map_to_model


# ---------------------- INTERNSHIP ----------------------

def create_internship(internship: InternshipInput, db: Session):
    new_internship = map_to_model(internship, Internship)
    internship_repo = InternshipRepo(db)
    created_internship = internship_repo.create(new_internship)
    internship_response = orm_to_dict(created_internship)
    return internship_response

def get_all_internships(db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_all()
    if not internships:
        return []
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def get_internship(internship_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internship = internship_repo.get_by_id(internship_id)
    if not internship:
        return None
    internship_response = orm_to_dict(internship)
    return internship_response

def get_internships_by_student(student_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_by_student_id(student_id)
    if not internships:
        return []
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def get_internships_by_site(site_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_by_site_id(site_id)
    if not internships:
        return []
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def update_internship(internship_id: int, internship_input: InternshipUpdate, db: Session):
    update_data = internship_input.dict(exclude_unset=True)
    internship_repo = InternshipRepo(db)
    updated_internship = internship_repo.update(internship_id, update_data)
    if not updated_internship:
        return None
    updated_internship_response = orm_to_dict(updated_internship)
    return updated_internship_response

def delete_internship(internship_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    return internship_repo.delete(internship_id)

# ---------------------- INTERNSHIP APPLICATION ----------------------

def create_internship_application(internship_application: InternshipApplicationInput, db: Session):
    new_internship_application = map_to_model(internship_application, InternshipApplication)
    internship_application_repo = InternshipApplicationRepo(db)
    created_internship_application = internship_application_repo.create(new_internship_application)
    internship_application_response = orm_to_dict(created_internship_application)
    return internship_application_response

def get_all_internship_applications(db: Session):
    internship_application_repo = InternshipApplicationRepo(db)
    internship_applications = internship_application_repo.get_all()
    if not internship_applications:
        return []
    internship_applications_response = [orm_to_dict(internship_application) for internship_application in internship_applications]
    return internship_applications_response

def get_internship_application(application_id: int, db: Session):
    internship_application_repo = InternshipApplicationRepo(db)
    internship_application = internship_application_repo.get_by_id(application_id)
    if not internship_application:
        return None
    internship_application_response = orm_to_dict(internship_application)
    return internship_application_response

def get_internship_applications_by_student(student_id: int, db: Session):
    internship_application_repo = InternshipApplicationRepo(db)
    internship_applications = internship_application_repo.get_by_student_id(student_id)
    if not internship_applications:
        return []
    internship_applications_response = [orm_to_dict(internship_application) for internship_application in internship_applications]
    return internship_applications_response

def update_internship_application(application_id: int, internship_application_input: InternshipApplicationUpdate, db: Session):
    update_data = internship_application_input.dict(exclude_unset=True)
    internship_application_repo = InternshipApplicationRepo(db)
    updated_internship_application = internship_application_repo.update(application_id, update_data)
    if not updated_internship_application:
        return None
    updated_internship_application_response = orm_to_dict(updated_internship_application)
    return updated_internship_application_response

def delete_internship_application(application_id: int, db: Session):
    internship_application_repo = InternshipApplicationRepo(db)
    return internship_application_repo.delete(application_id)

# ---------------------- INTERNSHIP DOCUMENT ----------------------

def create_internship_document(internship_document: InternshipDocumentInput, db: Session):
    new_internship_document = map_to_model(internship_document, InternshipDocument)
    internship_document_repo = InternshipDocumentRepo(db)
    created_internship_document = internship_document_repo.create(new_internship_document)
    internship_document_response = orm_to_dict(created_internship_document)
    return internship_document_response

def get_all_internship_documents(internship_id: int, db: Session):
    internship_document_repo = InternshipDocumentRepo(db)
    internship_documents = internship_document_repo.get_all(internship_id)
    if not internship_documents:
        return []
    internship_documents_response = [orm_to_dict(internship_document) for internship_document in internship_documents]
    return internship_documents_response

def get_internship_documents_by_id(internship_id: int, document_id: int, db: Session):
    internship_document_repo = InternshipDocumentRepo(db)
    internship_document = internship_document_repo.get_by_id(internship_id, document_id)
    if not internship_document:
        return None
    internship_document_response = orm_to_dict(internship_document)
    return internship_document_response

def update_internship_document(internship_id: int, document_id: int, internship_document_input: InternshipDocumentUpdate, db: Session):
    update_data = internship_document_input.dict(exclude_unset=True)
    internship_document_repo = InternshipDocumentRepo(db)
    document = internship_document_repo.get_by_id(internship_id, document_id)
    if not document:
        return None
    updated_internship_document = internship_document_repo.update(document_id, update_data)
    if not updated_internship_document:
        return None
    updated_internship_document_response = orm_to_dict(updated_internship_document)
    return updated_internship_document_response

def delete_internship_document(internship_id: int, document_id: int, db: Session):
    internship_document_repo = InternshipDocumentRepo(db)
    document = internship_document_repo.get_by_id(internship_id, document_id)
    if not document:
        return False
    return internship_document_repo.delete(document_id)