from sqlalchemy.orm import Session
from schemas.internship import InternshipInput
from fastapi import HTTPException, status

def create_internship(internship: InternshipInput, db: Session):
    pass

def read_all_internships(skip: int, limit: int, db: Session):
    pass

def read_single_internship(internship_id: int, db: Session):
    pass

def update_internship(internship_id: int, internship: InternshipInput, db: Session):
    pass

def delete_internship(internship_id: int, db: Session):
    pass