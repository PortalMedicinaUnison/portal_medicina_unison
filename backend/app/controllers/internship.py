from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.internship import InternshipRepo, InternshipEnrollmentRepo
from models.internship import Internship, InternshipEnrollment
from schemas.internship import InternshipInput, InternshipEnrollmentInput
from utils.utils import orm_to_dict


# ---------------  Internship  ----------------------

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

def get_internships_by_student(student_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_by_student_id(student_id)
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def get_internships_by_site(site_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    internships = internship_repo.get_by_site_id(site_id)
    internships_response = [orm_to_dict(internship) for internship in internships]
    return internships_response

def update_internship(internship_id: int, internship: InternshipInput, db: Session):
    pass


# ---------------  Internship enrollments  ----------------------

def create_internship_enrollment(internship_enrollment: InternshipEnrollmentInput, db: Session):
    new_internship_enrollment = InternshipEnrollment(
        student_id = internship_enrollment.student_id,
        is_accepted = internship_enrollment.is_accepted
    )
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    created_internship_enrollment = internship_enrollment_repo.create(new_internship_enrollment)
    internship_enrollment_response = orm_to_dict(created_internship_enrollment)
    return internship_enrollment_response

def get_internship_enrollments_by_student(student_id: int, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    internship_enrollments = internship_enrollment_repo.get_by_student_id(student_id)
    internship_enrollments_response = [orm_to_dict(internship_enrollment) for internship_enrollment in internship_enrollments]
    return internship_enrollments_response

def get_internship_enrollments_by_status(is_accepted: bool, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    internship_enrollments = internship_enrollment_repo.get_by_status(is_accepted)
    internship_enrollments_response = [orm_to_dict(internship_enrollment) for internship_enrollment in internship_enrollments]
    return internship_enrollments_response

