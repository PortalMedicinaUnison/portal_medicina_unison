from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from schemas.student import PreRegisteredStudentSchema, PreRegisteredStudentBase
from controllers.pre_registered_students import create_pre_registered_student, get_pre_registered_students
from core.dependencies import get_db

router = APIRouter(prefix = "/pre_registered_students", tags = ["Pre-Registered Students"])

@router.post("/", response_model=PreRegisteredStudentSchema)
async def create_pre_registered_student_route(student: PreRegisteredStudentBase, db: Session = Depends(get_db)):
    return create_pre_registered_student(student, db)
    

@router.get("/", response_model=List[PreRegisteredStudentSchema])
async def get_pre_registered_students_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_pre_registered_students(skip, limit, db)
