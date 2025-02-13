from .base import BaseRepo
from models.internship import  InternshipEnrollment, Internship, InternshipDocument
from schemas.internship import InternshipInput, InternshipEnrollmentInput

class InternshipRepo(BaseRepo):

    def create():
        pass

    def get_by_id():
        pass

    def get_by_student_id():
        pass

    def get_by_site_id():
        pass

    def update():
        pass

    def delete():
        pass

class InternshipEnrollmentRepo(BaseRepo):

    def create():
        pass

    def get_by_id():
        pass

    def get_by_student_id():
        pass

    def get_by_status():
        pass


