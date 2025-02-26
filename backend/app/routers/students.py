from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.student import StudentBase, StudentSchema, StudentRequest
from schemas.admin import AdminSchema
from core.dependencies import get_db
from controllers.students import (
    create_student, update_student, read_all_students, read_single_student, upload_profile_picture, delete_student
)

router = APIRouter()

@router.get('/', response_model=List[StudentSchema])
async def read_students_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_all_students(db, skip, limit)

@router.get('/', response_model=StudentSchema)
async def read_student_route(student_id: int, db: Session = Depends(get_db)):
    return read_single_student(student_id, db)

@router.post('/', response_model=StudentSchema)
async def create_student_route(student: StudentBase, db: Session = Depends(get_db)):
    return create_student(student, db)

@router.patch('/', response_model=StudentSchema)
async def update_student_route(student: StudentSchema, db: Session = Depends(get_db)):
    return update_student(student, db)

@router.delete('/', response_model=StudentSchema)
async def delete_student_route(student_id: int, db: Session = Depends(get_db)):
    return delete_student(student_id, db)

# @router.put('/profile_picture/')
# async def upload_profile_picture_route(student_id: int = Form(...), image: UploadFile = File(...), db: Session = Depends(get_db)):
#     return upload_profile_picture(student_id, image, db)