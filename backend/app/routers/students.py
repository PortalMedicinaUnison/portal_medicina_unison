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



# @app.post('/students/', response_model=schemas.StudentSchema)
# async def create_student(student: schemas.StudentBase, db: db_dependency):
#     if not auth.is_student_accepted(db, student.file_number):
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Student not found in database"
#         )
    
#     student.password = auth.get_password_hash(student.password)
#     student = models.Student(**student.model_dump())
#     student.profile_image_path = os.path.join("default_picture.jpg")
#     db.add(student)
#     db.commit()
#     db.refresh(student)
#     return student

# @app.put('/students/', response_model=schemas.StudentSchema)
# async def update_student(student_form: schemas.StudentSchema, db: db_dependency):
#     student = db.query(models.Student).filter(models.Student.id == student_form.id).first()

#     if student is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Student not found in database"
#         )

#     for attr in vars(student_form):
#         value = getattr(student_form, attr)
#         if value:
#             setattr(student, attr, value)

#     db.commit()
#     db.refresh(student)
#     return student

# @app.post('/student/', response_model=schemas.StudentSchema)
# async def read_student(request: schemas.StudentRequest, db: db_dependency):
#     student = db.query(models.Student).filter(models.Student.id == request.student_id).first()
#     return student

# @app.get('/students/', response_model=Union[List[schemas.StudentSchema], List[schemas.AdminSchema]])
# async def read_students(db: db_dependency, skip: int = 0, limit: int = 10):
#     students = db.query(models.Student).offset(skip).limit(limit).all()
#     return students



@router.post('/', response_model=StudentSchema)
async def create_student_route(student: StudentBase, db: Session = Depends(get_db)):
    return create_student(student, db)

@router.put('/', response_model=StudentSchema)
async def update_student_route(student_form: StudentSchema, db: Session = Depends(get_db)):
    return update_student(student_form, db)

# @router.get('/', response_model=Union[List[StudentSchema], List[AdminSchema]])
@router.get('/', response_model=List[StudentSchema])
async def read_students_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return read_students(db, skip, limit)

@router.post('/single', response_model=StudentSchema)
async def read_student_route(request: StudentRequest, db: Session = Depends(get_db)):
    return read_student(request, db)

@router.put('/profile_picture/')
async def upload_profile_picture_route(student_id: int = Form(...), image: UploadFile = File(...), db: Session = Depends(get_db)):
    return upload_profile_picture(student_id, image, db)