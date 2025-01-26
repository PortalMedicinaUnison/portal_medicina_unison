from typing import List
from pydantic import BaseSettings, ValidationError


class Settings(BaseSettings):
    ENVIRONMENT: str = "dev"
    SECRET_KEY: str
    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_ALGORITHM: str = "HS256"

    # CORS settings
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    ORIGINS: List[str]

    class Config:
        env_file = ".env"

try:
    settings = Settings()
except ValidationError as e:
    raise ValueError(f"Configuración inválida: {e}")