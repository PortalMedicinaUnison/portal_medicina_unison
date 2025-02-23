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

@app.on_event("startup")
async def startup_db():
    pass
    # initialize_database()

app.include_router(students.router, prefix="/students", tags=["Students"])
app.include_router(medical_records.router, prefix="/medical-records", tags=["Medical Records"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(pre_registered_students.router, prefix="/pre-registered-students", tags=["Pre-Registered Students"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
