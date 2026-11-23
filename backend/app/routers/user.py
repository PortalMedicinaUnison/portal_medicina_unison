from typing import List, Optional

from fastapi import APIRouter, status

from controllers import user as controller
from core.dependencies import AdminUser, CurrentUser, DbSession, SuperAdminUser
from schemas.user import (
    EnrollmentBulkInput, EnrollmentBulkResult, EnrollmentInput, EnrollmentOutput, EnrollmentUpdate,
    PasswordChangeInput, UserOutput, UserRoleUpdate, UserUpdate,
)

# ----------------------  USER  ----------------------

user_router = APIRouter(prefix="/users", tags=["Usuarios"])


@user_router.get("/me", response_model=UserOutput)
def get_me(user: CurrentUser):
    return user


@user_router.patch("/me", response_model=UserOutput)
def update_me(data: UserUpdate, user: CurrentUser, db: DbSession):
    return controller.update_own_profile(db, user, data)


@user_router.put("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_my_password(data: PasswordChangeInput, user: CurrentUser, db: DbSession):
    controller.change_password(db, user, data)


@user_router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_me(user: CurrentUser, db: DbSession):
    controller.deactivate_own_account(db, user)


@user_router.get("", response_model=List[UserOutput])
def list_users(
    _admin: AdminUser, db: DbSession,
    is_admin: Optional[bool] = None, academic_id: Optional[str] = None, q: Optional[str] = None,
):
    """Filtros: `is_admin`, `academic_id` y `q` (búsqueda por nombre, correo o expediente)."""
    return controller.list_users(db, is_admin=is_admin, academic_id=academic_id, search=q)


@user_router.get("/{user_id}", response_model=UserOutput)
def get_user(user_id: int, _admin: AdminUser, db: DbSession):
    return controller.get_user(db, user_id)


@user_router.patch("/{user_id}", response_model=UserOutput)
def update_user(user_id: int, data: UserUpdate, admin: AdminUser, db: DbSession):
    return controller.update_user(db, admin, user_id, data)


@user_router.patch("/{user_id}/role", response_model=UserOutput)
def set_user_role(user_id: int, data: UserRoleUpdate, super_admin: SuperAdminUser, db: DbSession):
    return controller.set_role(db, super_admin, user_id, data)


@user_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_user(user_id: int, admin: AdminUser, db: DbSession):
    controller.deactivate_user(db, admin, user_id)


# ----------------------  USER ENROLLMENT  ----------------------

user_enrollment_router = APIRouter(prefix="/enrollments", tags=["Pre-registro"])


@user_enrollment_router.get("", response_model=List[EnrollmentOutput])
def list_enrollments(_admin: AdminUser, db: DbSession, academic_id: Optional[str] = None, is_enrolled: Optional[bool] = None):
    return controller.list_enrollments(db, academic_id=academic_id, is_enrolled=is_enrolled)


@user_enrollment_router.post("", response_model=EnrollmentOutput, status_code=status.HTTP_201_CREATED)
def create_enrollment(data: EnrollmentInput, _admin: AdminUser, db: DbSession):
    return controller.create_enrollment(db, data)


@user_enrollment_router.post("/bulk", response_model=EnrollmentBulkResult)
def bulk_create_enrollments(data: EnrollmentBulkInput, _admin: AdminUser, db: DbSession):
    """Pre-registra varios expedientes (p. ej. importados de un CSV)."""
    return controller.bulk_create_enrollments(db, data.academic_ids)


@user_enrollment_router.get("/{enrollment_id}", response_model=EnrollmentOutput)
def get_enrollment(enrollment_id: int, _admin: AdminUser, db: DbSession):
    return controller.get_enrollment(db, enrollment_id)


@user_enrollment_router.patch("/{enrollment_id}", response_model=EnrollmentOutput)
def update_enrollment(enrollment_id: int, data: EnrollmentUpdate, _admin: AdminUser, db: DbSession):
    return controller.update_enrollment(db, enrollment_id, data)


@user_enrollment_router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_enrollment(enrollment_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_enrollment(db, enrollment_id)
