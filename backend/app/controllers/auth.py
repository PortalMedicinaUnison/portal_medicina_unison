from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, unauthorized
from core.security import create_access_token, hash_password, verify_password
from models.user import User
from repos.user import UserEnrollmentRepo, UserRepo
from schemas.auth import LoginInput, RegisterInput, TokenResponse


def login(db: Session, data: LoginInput) -> TokenResponse:
    user = UserRepo(db).get_by_email(data.email)
    if not verify_password(data.password, user.password if user else None):
        raise unauthorized("Correo o contraseña incorrectos.")
    return TokenResponse(access_token=create_access_token(user.user_id))


def register(db: Session, data: RegisterInput) -> User:
    """Crea la cuenta de un estudiante pre-registrado. Nunca crea administradores."""
    users = UserRepo(db)
    enrollment = UserEnrollmentRepo(db).get_by_academic_id(data.academic_id)
    if enrollment is None:
        raise bad_request("Tu expediente no está pre-registrado. Contacta a la coordinación del internado.")
    if users.get_by_academic_id(data.academic_id, include_inactive=True):
        raise conflict("Ya existe una cuenta con este expediente.")
    if users.get_by_email(data.email, include_inactive=True):
        raise conflict("Ya existe una cuenta con este correo.")

    user = User(
        academic_id=data.academic_id,
        first_name=data.first_name,
        last_name=data.last_name,
        second_last_name=data.second_last_name,
        email=data.email,
        phone_number=data.phone_number,
        password=hash_password(data.password),
        is_admin=False,
        is_super_admin=False,
    )
    db.add(user)
    enrollment.is_enrolled = True
    db.commit()
    db.refresh(user)
    return user


def refresh_token(user: User) -> TokenResponse:
    return TokenResponse(access_token=create_access_token(user.user_id))
