from typing import Optional

from pydantic import BaseModel, Field, computed_field, model_validator

from models.document import DocumentProviderEnum, DocumentStageEnum, ReviewStatusEnum
from models.promotion import ProgramEnum
from schemas.common import OptionalStr, ORMModel, RequiredStr, UTCDateTime


# ---------------------- CATÁLOGO ----------------------

class DocumentRequirementInput(BaseModel):
    program: ProgramEnum
    stage: DocumentStageEnum
    name: RequiredStr(150)
    description: OptionalStr(2000) = None
    is_required: bool = True
    provided_by: DocumentProviderEnum = DocumentProviderEnum.STUDENT
    allows_multiple: bool = False
    validity_months: Optional[int] = Field(default=None, ge=1, le=60)
    sort_order: int = Field(default=0, ge=0, le=10000)


class DocumentRequirementUpdate(BaseModel):
    """El programa no se cambia: los archivos ya subidos pertenecen a expedientes de ese programa."""
    stage: DocumentStageEnum = None
    name: RequiredStr(150) = None
    description: OptionalStr(2000) = None
    is_required: bool = None
    provided_by: DocumentProviderEnum = None
    allows_multiple: bool = None
    validity_months: Optional[int] = Field(default=None, ge=1, le=60)
    sort_order: int = Field(default=None, ge=0, le=10000)


class DocumentRequirementOutput(ORMModel):
    requirement_id: int
    program: ProgramEnum
    stage: DocumentStageEnum
    name: str
    description: Optional[str] = None
    is_required: bool
    provided_by: DocumentProviderEnum
    allows_multiple: bool
    validity_months: Optional[int] = None
    sort_order: int
    has_template: bool
    template_filename: Optional[str] = None
    is_active: bool
    created_at: UTCDateTime
    updated_at: UTCDateTime


# ---------------------- EXPEDIENTE ----------------------

class ApplicationDocumentOutput(ORMModel):
    document_id: int
    requirement_id: int
    application_id: int
    # Incluye is_active: los archivos de un requisito retirado del catálogo se siguen mostrando.
    requirement: DocumentRequirementOutput
    media_type: str
    original_filename: Optional[str] = None
    review_status: ReviewStatusEnum
    review_comment: Optional[str] = None
    reviewed_at: Optional[UTCDateTime] = None
    uploaded_by_coordination: bool = False
    created_at: UTCDateTime


class DocumentReviewInput(BaseModel):
    review_status: ReviewStatusEnum
    review_comment: OptionalStr(2000) = None

    @model_validator(mode="after")
    def comment_required_for_observations(self):
        if self.review_status == ReviewStatusEnum.REJECTED and not self.review_comment:
            raise ValueError("Escribe las observaciones para el estudiante.")
        return self


class InscriptionProgress(BaseModel):
    """
    Avance de los documentos obligatorios de inscripción: `submitted` ya tienen un archivo en revisión
    o aprobado (basta para aceptar la asignación); `approved`, uno aprobado (para registrar la plaza);
    `rejected`, solo archivos con observaciones (el alumno debe subir el corregido).
    """
    required: int
    submitted: int
    approved: int
    rejected: int = 0

    @computed_field
    @property
    def all_submitted(self) -> bool:
        return self.submitted >= self.required

    @computed_field
    @property
    def complete(self) -> bool:
        return self.approved >= self.required
