from typing import Dict, Iterable, List, Optional

from models.document import ApplicationDocument, DocumentRequirement, DocumentStageEnum, ReviewStatusEnum
from models.promotion import ProgramEnum
from .base import BaseRepo


# ----------------------  CATÁLOGO  ----------------------

class DocumentRequirementRepo(BaseRepo[DocumentRequirement]):
    model = DocumentRequirement

    def list(
        self, program: Optional[ProgramEnum] = None, stage: Optional[DocumentStageEnum] = None,
        include_inactive: bool = False,
    ) -> List[DocumentRequirement]:
        query = self.session.query(DocumentRequirement) if include_inactive else self.query()
        if program is not None:
            query = query.filter(DocumentRequirement.program == program)
        if stage is not None:
            query = query.filter(DocumentRequirement.stage == stage)
        return query.order_by(
            DocumentRequirement.program, DocumentRequirement.stage,
            DocumentRequirement.sort_order, DocumentRequirement.requirement_id,
        ).all()

    def required(self, program: ProgramEnum, stage: DocumentStageEnum) -> List[DocumentRequirement]:
        return [r for r in self.list(program=program, stage=stage) if r.is_required]


# ----------------------  EXPEDIENTE  ----------------------

def application_column(program: ProgramEnum):
    """Columna del expediente según el programa de la asignación."""
    if program == ProgramEnum.INTERNSHIP:
        return ApplicationDocument.internship_application_id
    return ApplicationDocument.social_service_application_id


class ApplicationDocumentRepo(BaseRepo[ApplicationDocument]):
    model = ApplicationDocument

    def list_for_application(self, program: ProgramEnum, application_id: int) -> List[ApplicationDocument]:
        return (
            self.query()
            .filter(application_column(program) == application_id)
            .order_by(ApplicationDocument.requirement_id, ApplicationDocument.created_at)
            .all()
        )

    def get_for_application(self, program: ProgramEnum, application_id: int, document_id: int) -> Optional[ApplicationDocument]:
        return self.query().filter(
            application_column(program) == application_id,
            ApplicationDocument.document_id == document_id,
        ).first()

    def list_for_requirement(self, program: ProgramEnum, application_id: int, requirement_id: int) -> List[ApplicationDocument]:
        return self.query().filter(
            application_column(program) == application_id,
            ApplicationDocument.requirement_id == requirement_id,
        ).all()

    def requirement_ids_with_status(
        self, program: ProgramEnum, application_ids: Iterable[int],
        statuses: Iterable[ReviewStatusEnum] = (ReviewStatusEnum.APPROVED,),
    ) -> Dict[int, set]:
        """Por asignación, los requisitos con al menos un archivo en alguno de esos estados (una sola consulta)."""
        ids = list(application_ids)
        if not ids:
            return {}
        column = application_column(program)
        rows = (
            self.session.query(column, ApplicationDocument.requirement_id)
            .filter(
                ApplicationDocument.is_active.is_(True),
                ApplicationDocument.review_status.in_(list(statuses)),
                column.in_(ids),
            )
            .group_by(column, ApplicationDocument.requirement_id)
            .all()
        )
        approved: Dict[int, set] = {application_id: set() for application_id in ids}
        for application_id, requirement_id in rows:
            approved[application_id].add(requirement_id)
        return approved
