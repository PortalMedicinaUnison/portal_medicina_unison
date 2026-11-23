from fastapi import APIRouter, status

from controllers import auth as controller
from core.dependencies import CurrentUser, DbSession
from schemas.auth import LoginInput, RegisterInput, TokenResponse
from schemas.user import UserOutput

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


@auth_router.post("/login", response_model=TokenResponse)
def login(data: LoginInput, db: DbSession):
    """Inicia sesión y devuelve el token JWT (enviarlo como `Authorization: Bearer <token>`)."""
    return controller.login(db, data)


@auth_router.post("/register", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
def register(data: RegisterInput, db: DbSession):
    """Registro de estudiantes pre-registrados por la coordinación."""
    return controller.register(db, data)


@auth_router.post("/refresh", response_model=TokenResponse)
def refresh(user: CurrentUser):
    """Renueva el token de la sesión actual."""
    return controller.refresh_token(user)
