from typing import List

from fastapi import APIRouter

from controllers import inscription as controller
from core.dependencies import AdminUser, DbSession
from models.promotion import ProgramEnum
from schemas.inscription import (
    ApplicationUpdate, BulkAssignmentInput, BulkAssignmentResult, PlazaResultOutput, PlazaResultsInput,
)
from schemas.user import UserBasicOutput


def add_inscription_routes(router: APIRouter, program: ProgramEnum, application_output) -> None:
    """
    Rutas de inscripción en bloque del programa. Se registran antes que /{application_id}
    para que "candidates" no se interprete como un identificador.
    """

    @router.get("/candidates", response_model=List[UserBasicOutput])
    def list_candidates(promotion_id: int, _admin: AdminUser, db: DbSession):
        """Estudiantes que se pueden asignar a la promoción (sin asignación en ella ni el programa en curso o acreditado)."""
        return controller.candidates(db, program, promotion_id)

    @router.post("/bulk", response_model=BulkAssignmentResult)
    def bulk_assign(data: BulkAssignmentInput, _admin: AdminUser, db: DbSession):
        """Asigna varios estudiantes a la promoción (con su promedio, opcional). Informa lo que no procedió y por qué."""
        return controller.bulk_assign(db, program, data)

    @router.post("/plaza-results", response_model=List[PlazaResultOutput])
    def record_plaza_results(data: PlazaResultsInput, admin: AdminUser, db: DbSession):
        """Resultados del acto público: la sede o plaza de cada estudiante, con las mismas reglas que una por una."""
        return controller.record_plaza_results(db, admin, program, data)

    @router.patch("/{application_id}", response_model=application_output)
    def update_application(application_id: int, data: ApplicationUpdate, admin: AdminUser, db: DbSession):
        """Corrige datos de la asignación (por ahora, el promedio)."""
        return controller.update_application(db, admin, program, application_id, data)
