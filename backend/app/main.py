from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.settings import settings
from db.database import initialize_database
from routers import students, medical_records, auth, pre_registered_students, admin


app = FastAPI(    
    title="Medical Internships Platform",
    description="API for managing medical internships and related data",
    version="1.0.0",
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

# # Dependency to get the DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# db_dependency = Annotated[Session, Depends(get_db)]

# # request = Request
# token_dependency = Annotated[str, Depends(auth.oauth2_scheme)]

# # Create the database tables if they don't exist
# models.Base.metadata.create_all(bind=engine)

# PROFILE_PICTURE_LOCATION = os.path.join("..","..","frontend","public","profile_images")

# @app.post('/accepted_students/', response_model=schemas.AcceptedStudentSchema)
# async def create_accepted_student(student: schemas.AcceptedStudentBase, db: db_dependency):
#     student = models.AcceptedStudent(**student.model_dump())
#     db.add(student)
#     db.commit()
#     db.refresh(student)
#     return student

# @app.get('/accepted_students/', response_model=List[schemas.AcceptedStudentSchema])
# async def read_accepted_students(db: db_dependency, skip: int = 0, limit: int = 10):
#     students = db.query(models.AcceptedStudent).offset(skip).limit(limit).all()
#     return students

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

# @app.get('/students/', response_model=Union[List[schemas.StudentSchema], List[schemas.AdminSchema]])
# async def read_students(db: db_dependency, skip: int = 0, limit: int = 10):
#     students = db.query(models.Student).offset(skip).limit(limit).all()
#     return students

# @app.post('/student/', response_model=schemas.StudentSchema)
# async def read_student(request: schemas.StudentRequest, db: db_dependency):
#     student = db.query(models.Student).filter(models.Student.id == request.student_id).first()
#     return student

# @app.post('/get_current_user/', response_model=schemas.StudentSchema)
# async def get_current_user(request: schemas.TokenRequest, db: db_dependency):
#     user = auth.get_current_user(db, request.token)
#     return user

# @app.put('/profile_picture/')
# async def upload_profile_picture(db: db_dependency, student_id: int = Form(...), image: UploadFile = File(...)):

#     file_location = os.path.join(PROFILE_PICTURE_LOCATION, str(student_id) + ".jpg")

#     with open(file_location, "wb") as buffer:
#         buffer.write(await image.read())

#     student = db.query(models.Student).filter(models.Student.id == student_id).first()
#     student.profile_image_path = str(student_id) + ".jpg"
#     db.commit()
#     db.refresh(student)

#     return {"info": file_location, "student": student}

# @app.post("/token/")
# async def login_for_access_token(form_data: schemas.UserForm, db: db_dependency):
#     user = auth.authenticate_user(db, form_data.username, form_data.password, form_data.role)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     access_token = auth.create_access_token(data={"sub": user.email, "role": form_data.role})

#     return {"access_token": access_token, "token_type": "bearer"}

# @app.post("/check_auth")
# async def check_auth(request: schemas.TokenRequest, db: db_dependency):
#     user = auth.get_current_user(db, request.token)
#     return {"status": "valid", "user_info": user}

# @app.post('/medical_record/')#, response_model=schemas.StudentSchema)
# async def create_medical_record(medical_record: schemas.MedicalRecordSchema, db: db_dependency):
#     medical_record = models.MedicalRecord(**medical_record.model_dump())
#     db.add(medical_record)
#     db.commit()
#     db.refresh(medical_record)
#     return medical_record

# @app.put('/medical_record/', response_model=schemas.MedicalRecordSchema)
# async def update_medical_record(medical_record_form: schemas.MedicalRecordSchema, db: db_dependency):
#     medical_record = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medical_record_form.id).first()

#     if medical_record is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Medical record not found in database."
#         )

#     for attr in vars(medical_record):
#         value = getattr(medical_record, attr)
#         if value:
#             setattr(medical_record, attr, value)

#     db.commit()
#     db.refresh(medical_record)
#     return medical_record

# @app.get('/medical_record/', response_model=List[schemas.MedicalRecordSchema])
# async def read_medical_record(db: db_dependency, skip: int = 0, limit: int = 10):
#     medical_record = db.query(models.MedicalRecord).offset(skip).limit(limit).all()
#     return medical_record

# @app.get('academic_history')
# async def read_academic_history():
#     pass

# @app.get('activity_log')
# async def read_activity_log():
#     pass

@app.on_event("startup")
async def startup_db():
    pass
    # initialize_database()

app.include_router(students.router, prefix="/students", tags=["Students"])
app.include_router(medical_records.router, prefix="/medical-records", tags=["Medical Records"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(pre_registered_students.router, prefix="/pre-registered-students", tags=["Pre-Registered Students"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
