"""
Inscripción en bloque, comunes al internado y al servicio social:
- asignar varios estudiantes a una promoción (con su promedio),
- listar los candidatos de una promoción,
- registrar los resultados del acto público (la sede o plaza que eligió cada estudiante).
Cada operación aplica las mismas reglas que la operación individual; lo que no procede se
informa por estudiante sin detener al resto.
"""
from typing import List, Union

from fastapi import HTTPException
from sqlalchemy.orm import Session

from controllers import internship as internship_controller
from controllers import social_service as social_service_controller
from core.errors import bad_request, conflict, not_found
from models.internship import InternshipApplication, InternshipStatusEnum
from models.promotion import ProgramEnum
from models.social_service import SocialServiceApplication
from models.user import User
from repos.internship import InternshipApplicationRepo, InternshipRepo
from repos.promotion import PromotionRepo
from repos.social_service import SocialServiceApplicationRepo, SocialServiceRepo
from schemas.inscription import (
    ApplicationUpdate, BulkAssignmentInput, BulkAssignmentResult, BulkSkip, PlazaResultOutput, PlazaResultsInput,
)
from schemas.internship import InternshipApplicationInput, InternshipUpdate
from schemas.social_service import SocialServiceApplicationInput, SocialServiceUpdate
from utils.validation import validate_academic_id

Application = Union[InternshipApplication, SocialServiceApplication]

PROGRAMS = {
    ProgramEnum.INTERNSHIP: {
        "controller": internship_controller,
        "application_repo": InternshipApplicationRepo,
        "application_input": InternshipApplicationInput,
        "record": lambda application: application.internship,
        "update_record": lambda db, user, record, site_id: internship_controller.update_internship(
            db, user, record.internship_id, InternshipUpdate(site_id=site_id),
        ),
    },
    ProgramEnum.SOCIAL_SERVICE: {
        "controller": social_service_controller,
        "application_repo": SocialServiceApplicationRepo,
        "application_input": SocialServiceApplicationInput,
        "record": lambda application: application.social_service,
        "update_record": lambda db, user, record, site_id: social_service_controller.update_social_service(
            db, user, record.social_service_id, SocialServiceUpdate(site_id=site_id),
        ),
    },
}


def _promotion_of_program(db: Session, program: ProgramEnum, promotion_id: int):
    promotion = PromotionRepo(db).get(promotion_id)
    if promotion is None or promotion.program != program:
        raise bad_request("La promoción seleccionada no existe o no es de este programa.")
    return promotion


# ---------------------- ASIGNAR EN BLOQUE ----------------------

def bulk_assign(db: Session, program: ProgramEnum, data: BulkAssignmentInput) -> BulkAssignmentResult:
    config = PROGRAMS[program]
    _promotion_of_program(db, program, data.promotion_id)
    repo = config["application_repo"](db)
    created, updated, skipped, seen = [], [], [], set()

    for row in data.students:
        raw = row.academic_id.strip()
        try:
            academic_id = validate_academic_id(raw)
        except ValueError as exc:
            skipped.append(BulkSkip(academic_id=raw, reason=str(exc)))
            continue
        if academic_id in seen:
            continue
        seen.add(academic_id)

        existing = repo.get_by_promotion_student(data.promotion_id, academic_id)
        if existing is not None:
            if row.average is not None and existing.average != row.average:
                repo.update(existing, {"average": row.average})
                updated.append(academic_id)
            else:
                skipped.append(BulkSkip(academic_id=academic_id, reason="Ya está asignado a esta promoción."))
            continue
        try:
            config["controller"].create_application(db, config["application_input"](
                promotion_id=data.promotion_id, academic_id=academic_id, average=row.average,
            ))
            created.append(academic_id)
        except HTTPException as exc:
            db.rollback()
            skipped.append(BulkSkip(academic_id=academic_id, reason=str(exc.detail)))
    return BulkAssignmentResult(created=created, updated=updated, skipped=skipped)


# ---------------------- CANDIDATOS ----------------------

def candidates(db: Session, program: ProgramEnum, promotion_id: int) -> List[User]:
    """
    Estudiantes que se pueden asignar a la promoción: registrados, sin asignación en ella y sin el
    programa en curso o ya acreditado. Para servicio social, además, con el internado acreditado.
    """
    _promotion_of_program(db, program, promotion_id)
    students = (
        db.query(User)
        .filter(
            User.is_active.is_(True), User.academic_id.isnot(None),
            User.is_admin.is_(False), User.is_super_admin.is_(False),
        )
        .order_by(User.last_name, User.second_last_name, User.first_name)
        .all()
    )
    assigned = {a.academic_id for a in PROGRAMS[program]["application_repo"](db).list(promotion_id=promotion_id)}
    if program == ProgramEnum.INTERNSHIP:
        busy = {i.academic_id for i in InternshipRepo(db).list()}
        return [s for s in students if s.academic_id not in assigned and s.academic_id not in busy]
    accredited = {i.academic_id for i in InternshipRepo(db).list(status=InternshipStatusEnum.FINISHED)}
    busy = {s.academic_id for s in SocialServiceRepo(db).list()}
    return [
        s for s in students
        if s.academic_id in accredited and s.academic_id not in assigned and s.academic_id not in busy
    ]


# ---------------------- EDITAR LA ASIGNACIÓN ----------------------

def update_application(db: Session, user: User, program: ProgramEnum, application_id: int, data: ApplicationUpdate) -> Application:
    repo = PROGRAMS[program]["application_repo"](db)
    application = repo.get(application_id)
    if application is None:
        raise not_found("Asignación no encontrada.")
    repo.update(application, data.model_dump(exclude_unset=True))
    return PROGRAMS[program]["controller"].get_application_detail(db, user, application_id)


# ---------------------- RESULTADOS DEL ACTO ----------------------

def record_plaza_results(db: Session, user: User, program: ProgramEnum, data: PlazaResultsInput) -> List[PlazaResultOutput]:
    """Registra en orden la sede o plaza de cada estudiante; cada fila se valida como si fuera individual."""
    config = PROGRAMS[program]
    results = []
    for row in data.results:
        try:
            application = config["controller"].get_application(db, user, row.application_id)
            record = config["record"](application)
            if record is None:
                raise conflict("Aún no acepta su asignación.")
            config["update_record"](db, user, record, row.site_id)
            results.append(PlazaResultOutput(application_id=row.application_id, ok=True))
        except HTTPException as exc:
            db.rollback()
            results.append(PlazaResultOutput(application_id=row.application_id, ok=False, detail=str(exc.detail)))
    return results

