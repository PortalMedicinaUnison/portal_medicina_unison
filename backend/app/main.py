from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.settings import ORIGINS
from db.database import Base, engine
from routers import students, medical_records, auth, pre_registered_students, admin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(students.router)
app.include_router(medical_records.router)
app.include_router(authentication.router)
app.include_router(pre_registered_students.router)
app.include_router(admin.router)