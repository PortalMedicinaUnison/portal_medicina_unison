from pathlib import Path
from typing import List, Optional, Tuple

from fastapi import UploadFile
from sqlalchemy.orm import Session

from core.errors import bad_request, conflict, forbidden, not_found
from core.security import hash_password, verify_password
from models.user import User, UserEnrollment
from repos.user import UserEnrollmentRepo, UserRepo
from schemas.user import (
    EnrollmentBulkResult, EnrollmentInput, EnrollmentUpdate,
    PasswordChangeInput, UserRoleUpdate, UserUpdate,
)
from utils.file_handlers import delete_upload, image_media_type, resolve_upload, save_image_upload
from utils.validation import validate_academic_id


# ---------------------- USERS ----------------------

def list_users(
    db: Session, is_admin: Optional[bool], academic_id: Optional[str], search: Optional[str],
    include_inactive: bool = False,
) -> List[User]:
    return UserRepo(db).list(is_admin=is_admin, academic_id=academic_id, search=search, include_inactive=include_inactive)


def get_user(db: Session, user_id: int) -> User:
    """Para administración: también devuelve cuentas desactivadas."""
    user = UserRepo(db).get_any(user_id)
    if user is None:
        raise not_found("Usuario no encontrado.")
    return user


def _apply_profile_update(db: Session, user: User, data: UserUpdate) -> User:
    repo = UserRepo(db)
    payload = data.model_dump(exclude_unset=True)
    new_email = payload.get("email")
    if new_email and new_email != user.email and repo.get_by_email(new_email, include_inactive=True):
        raise conflict("Ya existe una cuenta con este correo.")
    return repo.update(user, payload)


def update_own_profile(db: Session, user: User, data: UserUpdate) -> User:
    return _apply_profile_update(db, user, data)


def update_user(db: Session, actor: User, user_id: int, data: UserUpdate) -> User:
    target = get_user(db, user_id)
    if target.is_staff and not actor.is_super_admin and target.user_id != actor.user_id:
        raise forbidden("Solo un super administrador puede editar a otros administradores.")
    return _apply_profile_update(db, target, data)


def change_password(db: Session, user: User, data: PasswordChangeInput) -> None:
    if not verify_password(data.current_password, user.password):
        raise bad_request("La contraseña actual es incorrecta.")
    UserRepo(db).update(user, {"password": hash_password(data.new_password)})


def set_role(db: Session, actor: User, user_id: int, data: UserRoleUpdate) -> User:
    target = get_user(db, user_id)
    if target.user_id == actor.user_id:
        raise bad_request("No puedes cambiar tu propio rol.")
    if target.is_super_admin:
        raise forbidden("No se puede cambiar el rol de un super administrador.")
    return UserRepo(db).update(target, {"is_admin": data.is_admin})


def deactivate_user(db: Session, actor: User, user_id: int) -> None:
    target = get_user(db, user_id)
    if target.user_id == actor.user_id:
        raise bad_request("No puedes desactivar tu propia cuenta desde aquí.")
    if target.is_staff and not actor.is_super_admin:
        raise forbidden("Solo un super administrador puede desactivar administradores.")
    if not target.is_active:
        raise conflict("La cuenta ya está desactivada.")
    UserRepo(db).soft_delete(target)


def reactivate_user(db: Session, actor: User, user_id: int) -> User:
    target = get_user(db, user_id)
    if target.is_active:
        raise conflict("La cuenta ya está activa.")
    if target.is_staff and not actor.is_super_admin:
        raise forbidden("Solo un super administrador puede reactivar administradores.")
    return UserRepo(db).update(target, {"is_active": True})


def deactivate_own_account(db: Session, user: User) -> None:
    if user.is_super_admin:
        raise bad_request("Un super administrador no puede desactivar su propia cuenta.")
    UserRepo(db).soft_delete(user)


# ---------------------- FOTO DE PERFIL ----------------------

def upload_own_photo(db: Session, user: User, file: UploadFile) -> User:
    new_path = save_image_upload(file, "profile-photos")
    old_path = user.profile_photo
    updated = UserRepo(db).update(user, {"profile_photo": new_path})
    delete_upload(old_path)
    return updated


def delete_own_photo(db: Session, user: User) -> User:
    old_path = user.profile_photo
    updated = UserRepo(db).update(user, {"profile_photo": None})
    delete_upload(old_path)
    return updated


def get_photo_file(db: Session, viewer: User, user_id: int) -> Tuple[Path, str]:
    """La foto la ven el propio usuario y la coordinación."""
    if viewer.user_id == user_id:
        target = viewer
    elif viewer.is_staff:
        target = get_user(db, user_id)
    else:
        raise not_found("Foto no encontrada.")
    if not target.profile_photo:
        raise not_found("El usuario no tiene foto.")
    return resolve_upload(target.profile_photo), image_media_type(target.profile_photo)


# ---------------------- USER ENROLLMENTS ----------------------

def list_enrollments(db: Session, academic_id: Optional[str], is_enrolled: Optional[bool]) -> List[UserEnrollment]:
    return UserEnrollmentRepo(db).list(academic_id=academic_id, is_enrolled=is_enrolled)


def get_enrollment(db: Session, enrollment_id: int) -> UserEnrollment:
    enrollment = UserEnrollmentRepo(db).get(enrollment_id)
    if enrollment is None:
        raise not_found("Pre-registro no encontrado.")
    return enrollment


def _create_or_reactivate_enrollment(repo: UserEnrollmentRepo, academic_id: str) -> Optional[UserEnrollment]:
    """Devuelve el pre-registro creado o reactivado; None si ya existía activo."""
    existing = repo.get_by_academic_id(academic_id, include_inactive=True)
    if existing is None:
        enrollment = UserEnrollment(academic_id=academic_id)
        repo.session.add(enrollment)
        return enrollment
    if existing.is_active:
        return None
    existing.is_active = True
    return existing


def create_enrollment(db: Session, data: EnrollmentInput) -> UserEnrollment:
    repo = UserEnrollmentRepo(db)
    enrollment = _create_or_reactivate_enrollment(repo, data.academic_id)
    if enrollment is None:
        raise conflict("Este expediente ya está pre-registrado.")
    db.commit()
    db.refresh(enrollment)
    return enrollment


def bulk_create_enrollments(db: Session, academic_ids: List[str]) -> EnrollmentBulkResult:
    repo = UserEnrollmentRepo(db)
    created, skipped, invalid, seen = [], [], [], set()
    for raw in academic_ids:
        value = (raw or "").strip()
        if not value or value in seen:
            continue
        seen.add(value)
        try:
            validate_academic_id(value)
        except ValueError:
            invalid.append(value)
            continue
        if _create_or_reactivate_enrollment(repo, value) is None:
            skipped.append(value)
        else:
            created.append(value)
    db.commit()
    return EnrollmentBulkResult(created=created, skipped=skipped, invalid=invalid)


def update_enrollment(db: Session, enrollment_id: int, data: EnrollmentUpdate) -> UserEnrollment:
    enrollment = get_enrollment(db, enrollment_id)
    return UserEnrollmentRepo(db).update(enrollment, data.model_dump(exclude_unset=True))


def delete_enrollment(db: Session, enrollment_id: int) -> None:
    enrollment = get_enrollment(db, enrollment_id)
    UserEnrollmentRepo(db).soft_delete(enrollment)
