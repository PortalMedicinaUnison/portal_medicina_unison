from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

for router in routers:
    app.include_router(router)
