from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.errors import register_exception_handlers
from core.settings import settings
from db.database import engine
from db.migrations import warn_if_migrations_pending
from routers import routers


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Las pruebas crean su propia BD en memoria sin Alembic.
    if settings.ENVIRONMENT != "test":
        warn_if_migrations_pending(engine)
    yield


app = FastAPI(
    lifespan=lifespan,
    title="Portal Internado de Medicina Unison",
    description="API para la gestión del internado médico de pregrado y el servicio social de Medicina.",
    version="1.0.0",
    # Sin documentación interactiva en producción.
    docs_url="/docs" if settings.ENVIRONMENT != "prod" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "prod" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "prod" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

register_exception_handlers(app)

for router in routers:
    app.include_router(router)


@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok"}
