from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.internship import InternshipRepo, InternshipEnrollmentRepo
from models.internship import Internship
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
    return created_internship.dict()

def read_internships_by_site(db: Session):
    internship_repo = InternshipRepo(db)
    read_internships = internship_repo.get_by_site_id()
    return [model.dict() for model in read_internships]

def read_internships_by_student(db: Session):
    internship_repo = InternshipRepo(db)
    read_internships = internship_repo.get_by_student_id()
    return [model.dict() for model in read_internships]

def read_single_internship(internship_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    read_internship = internship_repo.get_by_id(internship_id)
    return read_internship.dict()

def update_internship(internship_id: int, internship: InternshipInput, db: Session):
    pass
    # internship_repo = InternshipRepo(db)
    # updated_internship = internship_repo.update(internship_id, internship)
    # return updated_internship.dict()

def delete_internship(internship_id: int, db: Session):
    internship_repo = InternshipRepo(db)
    deleted_internship = internship_repo.delete(internship_id)
    return deleted_internship.dict()

# ---------------  Internship enrollments  ----------------------

def create_internship_enrollment(internship_enrollment: InternshipEnrollmentInput, db: Session):
    internship_enrollment_repo = InternshipRepo(db)
    new_internship_enrollment = Internship(
        student_id = internship_enrollment.student_id,
        is_accepted = internship_enrollment.is_accepted
    )
    created_internship_enrollment = internship_enrollment_repo.create(new_internship_enrollment)
    return created_internship_enrollment.dict()

def read_internship_enrollments_by_status(db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    read_internship_enrollments = internship_enrollment_repo.get_by_status()
    return [model.dict() for model in read_internship_enrollments]

def read_internship_enrollments_by_student(db: Session):
    internship_enrollment_repo = InternshipEnrollmentRepo(db)
    read_internship_enrollments = internship_enrollment_repo.get_by_student_id()
    return [model.dict() for model in read_internship_enrollments]

