from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import SessionLocal, engine, Base
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends
from models import models
from schemas import schemas
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
from api.dependencies import auth
from fastapi import HTTPException, status
from typing import Union
from fastapi import Response
from fastapi import Request
from fastapi import UploadFile, File
import os
from fastapi import Cookie


app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# request = Request
token_dependency = Annotated[str, Depends(auth.oauth2_scheme)]

# Create the database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

PROFILE_PICTURE_LOCATION = os.path.join("images")

@app.post('/accepted_students/', response_model=schemas.AcceptedStudentSchema)
async def create_accepted_student(student: schemas.AcceptedStudentBase, db: db_dependency):
    student = models.AcceptedStudent(**student.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@app.get('/accepted_students/', response_model=List[schemas.AcceptedStudentSchema])
async def read_accepted_students(db: db_dependency, skip: int = 0, limit: int = 10):
    students = db.query(models.AcceptedStudent).offset(skip).limit(limit).all()
    return students

@app.post('/students/', response_model=schemas.StudentSchema)
async def create_student(student: schemas.StudentBase, db: db_dependency):
    if not auth.is_student_accepted(db, student.file_number):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found in database"
        )
    
    student.password = auth.get_password_hash(student.password)
    student = models.Student(**student.model_dump())
    student.profile_image_path = PROFILE_PICTURE_LOCATION + "default_picture.jpg"
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@app.put('/students/', response_model=schemas.StudentSchema)
async def update_student(student_id: int, student_form: schemas.StudentBase, db: db_dependency):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found in database"
        )

    for attr in vars(student_form):
        value = getattr(student_form, attr)
        if value:
            setattr(student, attr, value)

    db.commit()
    db.refresh(student)
    return student

@app.get('/students/', response_model=Union[List[schemas.StudentSchema], List[schemas.AdminSchema]])
async def read_students(db: db_dependency, skip: int = 0, limit: int = 10):
    students = db.query(models.Student).offset(skip).limit(limit).all()
    return students

@app.get('/student/', response_model=schemas.StudentSchema)
async def read_student(db: db_dependency, student_id: int = 0):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    return student

@app.put('/profile_picture/')
async def upload_profile_picture(db: db_dependency, student_id: int, image: UploadFile = File(...)):

    file_location = os.path.join(PROFILE_PICTURE_LOCATION, str(student_id) + ".jpg")

    with open(file_location, "wb") as buffer:
        buffer.write(await image.read())

    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    student.profile_image_path = file_location
    db.commit()
    db.refresh(student)

    return {"info": file_location, "student": student}

# @app.post('/admin/', response_model=schemas.AdminSchema)
# async def create_admin(admin: schemas.AdminBase, db: db_dependency):
#     admin.password = auth.get_password_hash(admin.password)
#     admin = models.Admin(**admin.model_dump())
#     db.add(admin)
#     db.commit()
#     db.refresh(admin)
#     return admin

# @app.get('/admin/', response_model=List[schemas.AdminSchema])
# async def read_admins(db: db_dependency, skip: int = 0, limit: int = 10):
    students = db.query(models.Admin).offset(skip).limit(limit).all()
    return students

@app.post("/token/")
async def login_for_access_token(form_data: schemas.UserForm, response: Response, db: db_dependency):
    user = auth.authenticate_user(db, form_data.username, form_data.password, form_data.role)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email, "role": form_data.role})

    # response.set_cookie(key="access_token", value=access_token, httponly=False, secure=False, samesite="lax")
    # response.set_cookie(key="cheese", value="cheese")

    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/check_auth")
async def check_auth(request: schemas.TokenRequest, db: db_dependency):
    user = auth.get_current_user(db, request.token)
    return {"status": "valid", "user_info": user}

# @app.post("/test/")
# async def test(request: Request):
#     # response.set_cookie(key="cheese", value="cheese")
#     token = request.cookies.get("access_token")
#     return {"message": "Success", "token": token}

# @app.get("/get_token/")
# async def get_access_token(request: Request):
#     access_token = request.cookies.get("access_token")
#     if access_token is None:
#         raise HTTPException(
#             status_code=404,
#             detail="Access token not found"
#         )
#     return {"access_token": access_token, "token_type": "bearer"}

# @app.get("/get_current_user/", response_model=Union[schemas.StudentSchema, schemas.AdminSchema])
# async def get_user_by_token(request: Request, db: db_dependency):
#     token = auth.get_access_token(request)
#     user = auth.get_current_user(db, token)
#     return user

@app.post("/create_medical_record/")
async def create_medical_record():
    pass
# @app.get("/info_student/")
# async def info(request : Request):
#     try:
#         token = get_access_token(request)
#             # return RedirectResponse("/student/", status_code=status.HTTP_303_SEE_OTHER)
            
#         user = get_current_user(token)
#         if user is None:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
#     except exceptions.ExpiredSignatureError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
#     except exceptions.JWTError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate token")
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unexpected error: {e}")
    
#     return templates.TemplateResponse("info_student.html", {"request" : request, "user":user})