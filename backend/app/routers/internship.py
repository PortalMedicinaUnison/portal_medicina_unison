from typing import List, Optional

from fastapi import APIRouter, status

from controllers import internship as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from models.internship import ApplicationStatusEnum, InternshipStatusEnum
from models.promotion import ProgramEnum
from routers.document import add_expediente_routes
from routers.inscription import add_inscription_routes
from schemas.internship import InternshipApplicationInput, InternshipApplicationOutput, InternshipOutput, InternshipUpdate

# ----------------------  INTERNSHIP APPLICATION  ----------------------

internship_application_router = APIRouter(prefix="/internship-applications", tags=["Asignaciones de internado"])
# En bloque: /candidates, /bulk, /plaza-results y PATCH /{application_id} (antes de las rutas con id).
add_inscription_routes(internship_application_router, ProgramEnum.INTERNSHIP, InternshipApplicationOutput)


@internship_application_router.get("", response_model=List[InternshipApplicationOutput])
def list_applications(
    user: CurrentUser, db: DbSession,
    promotion_id: Optional[int] = None, academic_id: Optional[str] = None,
    status: Optional[ApplicationStatusEnum] = None,
):
    """Administradores: todas (con filtros). Estudiantes: solo las suyas, de la más reciente a la más antigua."""
    return controller.list_applications(db, user, promotion_id=promotion_id, academic_id=academic_id, status=status)


@internship_application_router.post("", response_model=InternshipApplicationOutput, status_code=status.HTTP_201_CREATED)
def create_application(data: InternshipApplicationInput, _admin: AdminUser, db: DbSession):
    return controller.create_application(db, data)


@internship_application_router.get("/{application_id}", response_model=InternshipApplicationOutput)
def get_application(application_id: int, user: CurrentUser, db: DbSession):
    return controller.get_application_detail(db, user, application_id)


@internship_application_router.post("/{application_id}/accept", response_model=InternshipOutput)
def accept_application(application_id: int, user: CurrentUser, db: DbSession):
    """El estudiante acepta su asignación: se crea su internado (sin sede, la asigna la coordinación)."""
    return controller.accept_application(db, user, application_id)


@internship_application_router.post("/{application_id}/decline", response_model=InternshipApplicationOutput)
def decline_application(application_id: int, user: CurrentUser, db: DbSession):
    return controller.decline_application(db, user, application_id)


@internship_application_router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_application(db, application_id)


# ----------------------  INTERNSHIP  ----------------------

internship_router = APIRouter(prefix="/internships", tags=["Internados"])


@internship_router.get("", response_model=List[InternshipOutput])
def list_internships(
    user: CurrentUser, db: DbSession,
    promotion_id: Optional[int] = None, site_id: Optional[int] = None,
    academic_id: Optional[str] = None, status: Optional[InternshipStatusEnum] = None,
):
    """Administradores: todos (con filtros). Estudiantes: solo los suyos, del más reciente al más antiguo."""
    return controller.list_internships(
        db, user, promotion_id=promotion_id, site_id=site_id, academic_id=academic_id, status=status,
    )


@internship_router.get("/{internship_id}", response_model=InternshipOutput)
def get_internship(internship_id: int, user: CurrentUser, db: DbSession):
    return controller.get_internship(db, user, internship_id)


@internship_router.patch("/{internship_id}", response_model=InternshipOutput)
def update_internship(internship_id: int, data: InternshipUpdate, admin: AdminUser, db: DbSession):
    """Asigna o cambia la sede (respetando el cupo) o el estatus del internado."""
    return controller.update_internship(db, admin, internship_id, data)


@internship_router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(internship_id: int, admin: AdminUser, db: DbSession):
    """Da de baja el internado; la asignación vuelve a quedar pendiente."""
    controller.delete_internship(db, admin, internship_id)


# Expediente: /internship-applications/{application_id}/documents...
add_expediente_routes(internship_application_router, ProgramEnum.INTERNSHIP)
