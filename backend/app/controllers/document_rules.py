"""
Reglas del expediente que usan los controladores de internado y de servicio social
(sin importarlos, para evitar dependencias circulares).
"""
from typing import Iterable, List, Sequence

from sqlalchemy.orm import Session

from core.errors import conflict
from models.document import DocumentStageEnum
from models.promotion import ProgramEnum
from repos.document import ApplicationDocumentRepo, DocumentRequirementRepo
from schemas.document import InscriptionProgress


def missing_required(db: Session, program: ProgramEnum, application_id: int, stage: DocumentStageEnum) -> List[str]:
    """Nombres de los documentos obligatorios de la etapa que aún no tienen un archivo aprobado."""
    required = DocumentRequirementRepo(db).required(program, stage)
    approved = ApplicationDocumentRepo(db).approved_requirement_ids(program, [application_id]).get(application_id, set())
    return [requirement.name for requirement in required if requirement.requirement_id not in approved]


def attach_inscription_progress(db: Session, program: ProgramEnum, applications: Sequence) -> Sequence:
    """Agrega `inscription_progress` a cada asignación (dos consultas para toda la lista)."""
    required_ids = {r.requirement_id for r in DocumentRequirementRepo(db).required(program, DocumentStageEnum.INSCRIPTION)}
    approved = ApplicationDocumentRepo(db).approved_requirement_ids(program, [a.application_id for a in applications])
    for application in applications:
        done = len(required_ids & approved.get(application.application_id, set()))
        application.inscription_progress = InscriptionProgress(required=len(required_ids), approved=done)
    return applications


def ensure_stages_complete(
    db: Session, program: ProgramEnum, application_id: int, stages: Iterable[DocumentStageEnum], action: str,
) -> None:
    """Lanza 409 con la lista de lo que falta si alguna de las etapas no está completa."""
    missing = [name for stage in stages for name in missing_required(db, program, application_id, stage)]
    if missing:
        raise conflict(f"{action} Falta aprobar: {', '.join(missing)}.")

# Para finalizar el internado o liberar el servicio social cuentan los documentos de durante y de término.
CLOSING_STAGES = (DocumentStageEnum.IN_PROGRESS, DocumentStageEnum.COMPLETION)
