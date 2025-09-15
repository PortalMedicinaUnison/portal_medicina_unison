from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from core.settings import settings
from db.database import initialize_database
from routers import routers


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
    initialize_database()

# Crear directorio de evidencia si no existe
evidence_dir = os.path.join("app", "evidence_files")
os.makedirs(evidence_dir, exist_ok=True)

# Montar el directorio de evidencia como archivos estáticos
app.mount("/evidence_files", StaticFiles(directory=evidence_dir), name="evidence_files")

for router in routers:
    app.include_router(router)
