from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from schemas.student import PreRegisteredStudentSchema, PreRegisteredStudentBase
from controllers.pre_registered_students import create_pre_registered_student, read_pre_registered_students, delete_pre_registered_student
from core.dependencies import get_db

# router = APIRouter(prefix = "/pre_registered_students", tags = ["Pre-Registered Students"])
router = APIRouter()

@router.post("/", response_model=PreRegisteredStudentSchema)
async def create_pre_registered_student_route(student: PreRegisteredStudentBase, db: Session = Depends(get_db)):
    return create_pre_registered_student(student, db)
    
@router.get("/", response_model=List[PreRegisteredStudentSchema])
async def read_pre_registered_students_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_pre_registered_students(skip, limit, db)
    
@router.delete("/", response_model=PreRegisteredStudentSchema)
async def delete_pre_registered_students_route(student_id: int, db: Session = Depends(get_db)):
    return delete_pre_registered_student(student_id, db)
