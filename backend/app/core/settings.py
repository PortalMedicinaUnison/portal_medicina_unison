from pathlib import Path
from typing import List, Optional
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import field_validator, model_validator
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
    # Zona horaria para "hoy" (fechas límite de encuestas, fechas de reportes, año de promociones).
    TIMEZONE: str = "America/Hermosillo"

    # Archivos subidos (documentos de internado). Ruta absoluta recomendada en producción.
    UPLOAD_DIR: Path = BACKEND_DIR / "uploads"
    MAX_UPLOAD_MB: int = 10
    MAX_PHOTO_MB: int = 2

    # Dirección pública del frontend (para los enlaces de los correos).
    FRONTEND_URL: str = "http://localhost:5173"

    # Restablecimiento de contraseña: vigencia de los enlaces.
    PASSWORD_RESET_HOURS: int = 24          # enlaces generados por la coordinación
    PASSWORD_RESET_EMAIL_MINUTES: int = 60  # enlaces enviados por correo

    # Correo saliente (opcional). Sin SMTP_HOST el restablecimiento lo hace la coordinación.
    # Sirve cualquier cuenta con SMTP, p. ej. una cuenta institucional o de Gmail (sin costo).
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: Optional[str] = None
    SMTP_STARTTLS: bool = True
    SMTP_SSL: bool = False

    # Versión del aviso de privacidad: al cambiarla, todos deben aceptarlo de nuevo.
    PRIVACY_NOTICE_VERSION: str = "2026-11"

    # CORS: en .env se escribe como JSON, p. ej. ORIGINS=["https://portal.unison.mx"]
    ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]

    @field_validator("DATABASE_URL")
    @classmethod
    def resolve_relative_sqlite_path(cls, url: str) -> str:
        """
        Una ruta SQLite relativa (sqlite:///data/portal.db) se resuelve desde backend/,
        así la app y Alembic usan el mismo archivo aunque se ejecuten desde carpetas distintas.
        """
        prefix = "sqlite:///"
        if url.startswith(prefix):
            path = url[len(prefix):]
            if path and not path.startswith(":") and not Path(path).is_absolute():
                return f"{prefix}{(BACKEND_DIR / path).resolve()}"
        return url

    @field_validator("TIMEZONE")
    @classmethod
    def check_timezone(cls, value: str) -> str:
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError):
            raise ValueError(f"Zona horaria desconocida: {value}")
        return value

    @model_validator(mode="after")
    def check_production_settings(self):
        if self.ENVIRONMENT == "prod" and len(self.SECRET_KEY) < 32:
            raise ValueError("En producción SECRET_KEY debe tener al menos 32 caracteres.")
        if self.ENVIRONMENT == "prod" and self.email_enabled and "localhost" in self.FRONTEND_URL:
            raise ValueError("Con el correo activado, FRONTEND_URL debe ser la dirección pública del portal.")
        return self

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_MB * 1024 * 1024

    @property
    def max_photo_bytes(self) -> int:
        return self.MAX_PHOTO_MB * 1024 * 1024

    @property
    def email_enabled(self) -> bool:
        return bool(self.SMTP_HOST and self.SMTP_FROM)


settings = Settings()
