from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.internship import Internship, InternshipEnrollment, InternshipDocument
from repos.internship import InternshipRepo, InternshipEnrollmentRepo, InternshipDocumentRepo
from schemas.internship import (
    InternshipInput, 
    InternshipEnrollmentInput,
    InternshipEnrollmentUpdate, 
    InternshipDocumentInput,
    InternshipDocumentUpdate,
)
from utils.utils import orm_to_dict

# ----------------------  Internship  ----------------------

def create_internship(internship: InternshipInput, db: Session):
    new_internship = Internship(
        enrollment_id = internship.enrollment_id,
        student_id = internship.student_id,
        site_id = internship.site_id,
        year = internship.year,
        period = internship.period,
        status = internship.status
    )
    internship_repo = InternshipRepo(db)
    created_internship = internship_repo.create(new_internship)
    internship_response = orm_to_dict(created_internship)
    return internship_response

def get_internship(internship_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internship = internship_repo.get_by_id(internship_id)
    if internship is None:
        return None
    internship_response = orm_to_dict(internship)
    return internship_response

def get_all_internships(db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_all()
    if internships is None:
        return None
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def get_internships_by_student(student_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_by_student_id(student_id)
    if internships is None:
        return None
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def get_internships_by_site(site_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_by_site_id(site_id)
    if internships is None:
        return None
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def update_internship(internship_id: int, internship_input: InternshipInput, db: Session):
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

# ----------------------  Internship enrollments  ----------------------

def create_internship_enrollment(internship_enrollment: InternshipEnrollmentInput, db: Session):
    new_internship_enrollment = InternshipEnrollment(
        student_id = internship_enrollment.student_id,
        is_accepted = internship_enrollment.is_accepted
    )
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    created_internship_enrollment = internship_enrollment_repo.create(new_internship_enrollment)
    internship_enrollment_response = orm_to_dict(created_internship_enrollment)
    return internship_enrollment_response

def get_all_internship_enrollments(db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    internship_enrollments = internship_enrollment_repo.get_all()
    if internship_enrollments is None:
        return None
    internship_enrollments_response = [orm_to_dict(internship_enrollment) for internship_enrollment in internship_enrollments]
    return internship_enrollments_response

def get_internship_enrollments_by_student(student_id: int, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    internship_enrollments = internship_enrollment_repo.get_by_student_id(student_id)
    if internship_enrollments is None:
        return None
    internship_enrollments_response = [orm_to_dict(internship_enrollment) for internship_enrollment in internship_enrollments]
    return internship_enrollments_response

def get_internship_enrollments_by_status(status: bool, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    internship_enrollments = internship_enrollment_repo.get_by_status(status)
    if internship_enrollments is None:
        return None
    internship_enrollments_response = [orm_to_dict(internship_enrollment) for internship_enrollment in internship_enrollments]
    return internship_enrollments_response

def update_internship_enrollment(enrollment_id: int, internship_enrollment_input: InternshipEnrollmentUpdate, db: Session):
    update_data = internship_enrollment_input.dict(exclude_unset=True)
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    updated_internship_enrollment = internship_enrollment_repo.update(enrollment_id, update_data)
    if not updated_internship_enrollment:
        return None
    updated_internship_enrollment_response = orm_to_dict(updated_internship_enrollment)
    return updated_internship_enrollment_response

def delete_internship_enrollment(enrollment_id: int, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    return internship_enrollment_repo.delete(enrollment_id)

# ----------------------  Internship documents  ----------------------

def create_internship_document(internship_document: InternshipDocumentInput, db: Session):
    new_internship_document = InternshipDocument(
        internship_id = internship_document.internship_id,
        document_type = internship_document.document_type,
        path = internship_document.path,
        is_verified = internship_document.is_verified
    )
    internship_document_repo = InternshipDocumentRepo(db)
    created_internship_document = internship_document_repo.create(new_internship_document)
    internship_document_response = orm_to_dict(created_internship_document)
    return internship_document_response

def get_internship_documents_by_id(document_id: str, db: Session):
    internship_document_repo = InternshipDocumentRepo(db)
    internship_document = internship_document_repo.get_by_id(document_id)
    if internship_document is None:
        return None
    internship_document_response = orm_to_dict(internship_document)
    return internship_document_response

def get_all_internship_documents(db: Session):
    internship_document_repo = InternshipDocumentRepo(db)
    internship_documents = internship_document_repo.get_all()
    if internship_documents is None:
        return None
    internship_documents_response = [orm_to_dict(internship_document) for internship_document in internship_documents]
    return internship_documents_response

def get_internship_documents_by_internship(internship_id: int, db: Session):
    internship_document_repo = InternshipDocumentRepo(db)
    internship_documents = internship_document_repo.get_by_internship_id(internship_id)
    if internship_documents is None:
        return None
    internship_documents_response = [orm_to_dict(internship_document) for internship_document in internship_documents]
    return internship_documents_response

def update_internship_document(document_id: str, internship_document_input: InternshipDocumentUpdate, db: Session):
    update_data = internship_document_input.dict(exclude_unset=True)
    internship_document_repo = InternshipDocumentRepo(db)
    updated_internship_document = internship_document_repo.update(document_id, update_data)
    if not updated_internship_document:
        return None
    updated_internship_document_response = orm_to_dict(updated_internship_document)
    return updated_internship_document_response

def delete_internship_document(document_id: str, db: Session):
    internship_document_repo = InternshipDocumentRepo(db)
    return internship_document_repo.delete(document_id)