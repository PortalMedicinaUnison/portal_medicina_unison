import pytest
from repos.internship import InternshipRepo, InternshipEnrollmentRepo
from models.internship import Internship, InternshipEnrollment

def test_create_internship(db_session):
    internship_repo = InternshipRepo(db_session)
    internship = Internship(
        student_id=1,
        site_id=2,
        year=2024,
        period=1,
        status=1,
        enrollment_id=1
    )
    created_internship = internship_repo.create(internship)
    assert created_internship.internship_id is not None
    assert created_internship.student_id == 1

def test_get_internship_by_id(db_session):
    internship_repo = InternshipRepo(db_session)
    internship = Internship(
        student_id=1,
        site_id=2,
        year=2024,
        period=1,
        status=1,
        enrollment_id=1
    )
    created_internship = internship_repo.create(internship)
    fetched_internship = internship_repo.get_by_id(created_internship.internship_id)
    assert fetched_internship is not None
    assert fetched_internship.student_id == 1

def test_update_internship(db_session):
    internship_repo = InternshipRepo(db_session)
    internship = Internship(
        student_id=1,
        site_id=2,
        year=2024,
        period=1,
        status=1,
        enrollment_id=1
    )
    created_internship = internship_repo.create(internship)
    updated_data = {"status": 2}
    internship_repo.update(created_internship.internship_id, updated_data)
    updated_internship = internship_repo.get_by_id(created_internship.internship_id)
    assert updated_internship.status == 2

def test_create_internship_enrollment(db_session):
    internship_repo = InternshipEnrollmentRepo(db_session)
    enrollment = InternshipEnrollment(
        student_id=1,
        is_accepted=False
    )
    created_enrollment = internship_repo.create(enrollment)
    assert created_enrollment.enrollment_id is not None
    assert created_enrollment.is_accepted is False

def test_get_internship_enrollment_by_student_id(db_session):
    internship_repo = InternshipEnrollmentRepo(db_session)
    enrollment = InternshipEnrollment(
        student_id=1,
        is_accepted=False
    )
    internship_repo.create(enrollment)
    enrollments = internship_repo.get_by_student_id(1)
    assert len(enrollments) > 0
    assert enrollments[0].student_id == 1
