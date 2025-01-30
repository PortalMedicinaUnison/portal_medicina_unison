from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Union
from schemas.student import StudentBase, StudentSchema, StudentRequest
from schemas.admin import AdminSchema
from core.dependencies import get_db
from controllers.students import (
    create_student, update_student, read_students, read_student, upload_profile_picture
)


router = APIRouter(prefix="/students" , tags=["Students"])

db_dependency = Depends(get_db)


@router.post('/', response_model=StudentSchema)
async def create_student_route(student: StudentBase, db: Session = db_dependency):
    return create_student(student, db)

@router.put('/', response_model=StudentSchema)
async def update_student_route(student_form: StudentSchema, db: Session = db_dependency):
    return update_student(student_form, db)

@router.get('/', response_model=Union[List[StudentSchema], List[AdminSchema]])
async def read_students_route(skip: int = 0, limit: int = 10, db: Session = db_dependency):
    return read_students(db, skip, limit)

@router.post('/single', response_model=StudentSchema)
async def read_student_route(request: StudentRequest, db: Session = db_dependency):
    return read_student(request, db)

@router.put('/profile_picture/')
async def upload_profile_picture_route(student_id: int = Form(...), image: UploadFile = File(...), db: Session = db_dependency):
    return upload_profile_picture(student_id, image, db)