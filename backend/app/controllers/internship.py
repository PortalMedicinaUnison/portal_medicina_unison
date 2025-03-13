from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.internship import InternshipRepo, InternshipEnrollmentRepo
from models.internship import Internship, InternshipEnrollment
from schemas.internship import InternshipInput, InternshipEnrollmentInput

# ---------------  Internship  ----------------------

def create_internship(internship: InternshipInput, db: Session):
    internship_repo = InternshipRepo(db)
    new_internship = Internship(
        enrollment_id = internship.enrollment_id,
        student_id = internship.student_id,
        site_id = internship.site_id,
        year = internship.year,
        period = internship.period,
        status = internship.status
    )
    created_internship = internship_repo.create(new_internship)
    return created_internship.__dict__


def read_single_internship(internship_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    read_internship = internship_repo.get_by_id(internship_id)
    if read_internship is None:
        return None
    return read_internship.__dict__

def read_internships_by_student(student_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    read_internships = internship_repo.get_by_student_id(student_id)
    return [model.__dict__ for model in read_internships]

def read_internships_by_site(site_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    read_internships = internship_repo.get_by_site_id(site_id)
    return [model.__dict__ for model in read_internships]

def update_internship(internship_id: int, internship: InternshipInput, db: Session):
    pass
    # internship_repo = InternshipRepo(db)
    # updated_internship = internship_repo.update(internship_id, internship)
    # return updated_internship.__dict__

# ---------------  Internship enrollments  ----------------------

def create_internship_enrollment(internship_enrollment: InternshipEnrollmentInput, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    new_internship_enrollment = InternshipEnrollment(
        student_id = internship_enrollment.student_id,
        is_accepted = internship_enrollment.is_accepted
    )
    created_internship_enrollment = internship_enrollment_repo.create(new_internship_enrollment)
    return created_internship_enrollment.__dict__

def read_internship_enrollments_by_student(student_id: int, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    read_internship_enrollments = internship_enrollment_repo.get_by_student_id(student_id)
    return [model.__dict__ for model in read_internship_enrollments]

def read_internship_enrollments_by_status(is_accepted: bool, db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    read_internship_enrollments = internship_enrollment_repo.get_by_status(is_accepted)
    return [model.__dict__ for model in read_internship_enrollments]

