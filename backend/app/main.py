from fastapi import FastAPI, Form, Request, Response
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
# import sqlite3

from api.dependencies.auth import authenticate_user, create_access_token, hash_password, get_current_user, get_access_token
from fastapi import Depends, HTTPException, status
from jose import exceptions

from db.database import engine, Base, get_db
from models.models import Item, ItemCreate, ItemResponse
from crud.crud import get_items, get_item_by_id, create_item, update_item, delete_item, get_user
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"]
)

# app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return RedirectResponse("/home/", status_code=303)

@app.get("/home/")
async def home(request : Request):
    return templates.TemplateResponse("home.html", {"request" : request})

@app.get("/student/")
async def student(request : Request):
    return templates.TemplateResponse("student.html", {"request" : request})

@app.get("/register/")
async def register(request : Request):
    return templates.TemplateResponse("register_student.html", {"request" : request})

@app.post("/token/")
async def create_token(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
    ):

    user = authenticate_user(email, password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})

    response = RedirectResponse("/info_student/", status_code=status.HTTP_303_SEE_OTHER)

    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="strict")

    return response
    # return {"access_token": access_token, "token_type": "bearer"}


@app.get("/info_student/")
async def info(request : Request):
    try:
        token = get_access_token(request)
            # return RedirectResponse("/student/", status_code=status.HTTP_303_SEE_OTHER)
            
        user = get_current_user(token)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    except exceptions.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except exceptions.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate token")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Unexpected error {e}")
    
    return templates.TemplateResponse("info_student.html", {"request" : request, "user":user})

@app.post("/create_student/")
async def signup(
    name : str = Form(...),
    pat_last_name : str = Form(...),
    mat_last_name : str = Form(...),
    file_number : int = Form(...),
    email : str = Form(...),
    conf_email : str = Form(...),
    password : str = Form(...),
    conf_password : str = Form(...),
    db: Session = Depends(get_db)
    ):

    if(email != conf_email):
        return RedirectResponse("/register/")
    elif(password != conf_password):
        return RedirectResponse("/register/")
    else:
        student = ItemCreate(
            name=name,
            pat_last_name=pat_last_name,
            mat_last_name=mat_last_name,
            file_number=file_number,
            email=email,
            password=hash_password(password)
        )
        create_item(db=db, item=student)
        return RedirectResponse("/student/", status_code=303)

@app.get("/admin/")
async def admin(request : Request):
    context = {
        "request" : request
    }
    return templates.TemplateResponse("admin.html", context)

@app.get("/delete_token/")
async def delete_token(response: Response):
    response = RedirectResponse("/student/", status_code=303)
    response.delete_cookie("access_token")
    return response