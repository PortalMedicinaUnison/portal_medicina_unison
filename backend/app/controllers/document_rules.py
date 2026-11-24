"""
Reglas del expediente que usan los controladores de internado y de servicio social
(sin importarlos, para evitar dependencias circulares).
"""
from typing import Iterable, List, Sequence

from sqlalchemy.orm import Session

from core.errors import conflict
from models.document import DocumentStageEnum, ReviewStatusEnum
from models.promotion import ProgramEnum
from repos.document import ApplicationDocumentRepo, DocumentRequirementRepo
from schemas.document import InscriptionProgress

APPROVED = (ReviewStatusEnum.APPROVED,)
# "Enviado": hay un archivo en revisión o aprobado (uno con observaciones hay que corregirlo).
SUBMITTED = (ReviewStatusEnum.PENDING, ReviewStatusEnum.APPROVED)

# Para finalizar el internado o liberar el servicio social cuentan los documentos de durante y de término.
CLOSING_STAGES = (DocumentStageEnum.IN_PROGRESS, DocumentStageEnum.COMPLETION)


def missing_required(
    db: Session, program: ProgramEnum, application_id: int, stage: DocumentStageEnum,
    statuses: Iterable[ReviewStatusEnum] = APPROVED,
) -> List[str]:
    """Nombres de los documentos obligatorios de la etapa sin un archivo en alguno de esos estados."""
    required = DocumentRequirementRepo(db).required(program, stage)
    done = ApplicationDocumentRepo(db).requirement_ids_with_status(program, [application_id], statuses).get(application_id, set())
    return [requirement.name for requirement in required if requirement.requirement_id not in done]


def attach_inscription_progress(db: Session, program: ProgramEnum, applications: Sequence) -> Sequence:
    """Agrega `inscription_progress` a cada asignación (tres consultas para toda la lista)."""
    required_ids = {r.requirement_id for r in DocumentRequirementRepo(db).required(program, DocumentStageEnum.INSCRIPTION)}
    ids = [a.application_id for a in applications]
    repo = ApplicationDocumentRepo(db)
    approved = repo.requirement_ids_with_status(program, ids, APPROVED)
    submitted = repo.requirement_ids_with_status(program, ids, SUBMITTED)
    for application in applications:
        application.inscription_progress = InscriptionProgress(
            required=len(required_ids),
            submitted=len(required_ids & submitted.get(application.application_id, set())),
            approved=len(required_ids & approved.get(application.application_id, set())),
        )
    return applications


def ensure_stages_complete(
    db: Session, program: ProgramEnum, application_id: int, stages: Iterable[DocumentStageEnum], action: str,
) -> None:
    """Lanza 409 con la lista de lo que falta si alguna de las etapas no tiene sus obligatorios aprobados."""
    missing = [name for stage in stages for name in missing_required(db, program, application_id, stage)]
    if missing:
        raise conflict(f"{action} Falta aprobar: {', '.join(missing)}.")


def ensure_inscription_submitted(db: Session, program: ProgramEnum, application_id: int) -> None:
    """Para aceptar la asignación hay que haber subido todos los obligatorios de inscripción."""
    missing = missing_required(db, program, application_id, DocumentStageEnum.INSCRIPTION, SUBMITTED)
    if missing:
        raise conflict(
            "Antes de aceptar, sube todos los documentos obligatorios de inscripción "
            f"(y corrige los que tengan observaciones). Pendientes: {', '.join(missing)}."
        )
