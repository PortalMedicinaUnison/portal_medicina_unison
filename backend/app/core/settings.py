from pathlib import Path
from typing import List

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Carpeta backend/ (este archivo vive en backend/app/core/).
BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """
    Configuración leída de variables de entorno o de backend/.env.
    Las variables de entorno tienen prioridad sobre el archivo .env.
    """

    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    ENVIRONMENT: str = "dev"  # "dev" o "prod"
    SECRET_KEY: str
    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    JWT_ALGORITHM: str = "HS256"

    # Archivos subidos (documentos de internado). Ruta absoluta recomendada en producción.
    UPLOAD_DIR: Path = BACKEND_DIR / "uploads"
    MAX_UPLOAD_MB: int = 10

    # CORS: en .env se escribe como JSON, p. ej. ORIGINS=["https://portal.unison.mx"]
    ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]

    @model_validator(mode="after")
    def check_production_secret(self):
        if self.ENVIRONMENT == "prod" and len(self.SECRET_KEY) < 32:
            raise ValueError("En producción SECRET_KEY debe tener al menos 32 caracteres.")
        return self

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_MB * 1024 * 1024


settings = Settings()
