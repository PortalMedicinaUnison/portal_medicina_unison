from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.internship import InternshipInput
from core.dependencies import get_db
from controllers.internship import (
    create_internship, update_internship, read_all_internships, read_single_internship, delete_internship
)

internship_router = APIRouter(prefix="/internships", tags=["Internados"])

@internship_router.post('/', response_model=InternshipInput)
async def create_internship_route(internship: InternshipInput, db: Session = Depends(get_db)):
    return create_internship(internship, db)

@internship_router.get('/', response_model=List[InternshipInput])
async def read_internships_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_all_internships(skip, limit, db)

@internship_router.get('/', response_model=InternshipInput)
async def read_internship_route(internship_id: int, db: Session = Depends(get_db)):
    return read_single_internship(internship_id, db)

@internship_router.patch('/', response_model=InternshipInput)
async def update_internship_route(internship_id: int, internship: InternshipInput, db: Session = Depends(get_db)):
    return update_internship(internship_id, internship, db)

@internship_router.delete('/', response_model=InternshipInput)
async def delete_internship_route(internship_id: int, db: Session = Depends(get_db)):
    return delete_internship(internship_id, db)