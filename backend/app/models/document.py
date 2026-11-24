from datetime import datetime
from enum import IntEnum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel
from .promotion import ProgramEnum
from .types import IntEnumType

if TYPE_CHECKING:
    from .user import User


class DocumentStageEnum(IntEnum):
    """Etapa del programa en la que se entrega el documento."""
    INSCRIPTION = 1   # Inscripción: antes de registrar la plaza
    IN_PROGRESS = 2   # Durante el internado o el servicio social
    COMPLETION = 3    # Término del internado / liberación del servicio social


class DocumentProviderEnum(IntEnum):
    """Quién sube el documento al expediente."""
    STUDENT = 1        # el alumno; la coordinación lo revisa
    COORDINATION = 2   # la coordinación (p. ej. la constancia que emite la institución de salud); queda aprobado


class ReviewStatusEnum(IntEnum):
    PENDING = 1    # En revisión
    APPROVED = 2   # Aprobado
    REJECTED = 3   # Con observaciones


# ----------------------  CATÁLOGO  ----------------------

class DocumentRequirement(BaseModel):
    """
    Documento que se pide en una etapa de un programa. El catálogo lo edita la coordinación;
    borrar un requisito solo lo retira (is_active = False) y los archivos ya subidos se conservan.
    """
    __tablename__ = "document_requirements"
    __table_args__ = (Index("idx_requirement_program_stage", "program", "stage"),)

    requirement_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    program: Mapped[ProgramEnum] = mapped_column(IntEnumType(ProgramEnum), nullable=False)
    stage: Mapped[DocumentStageEnum] = mapped_column(IntEnumType(DocumentStageEnum), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    provided_by: Mapped[DocumentProviderEnum] = mapped_column(
        IntEnumType(DocumentProviderEnum), nullable=False, default=DocumentProviderEnum.STUDENT, server_default="1",
    )
    # Varios archivos para el mismo requisito (p. ej. bitácoras o reportes trimestrales).
    allows_multiple: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # Antigüedad máxima del documento en meses (informativa: la revisa la coordinación).
    validity_months: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    # Formato descargable (PDF, Word, Excel...) que sube la coordinación.
    template_path: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    template_media_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    template_filename: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    @property
    def has_template(self) -> bool:
        return bool(self.template_path)

    def __repr__(self):
        return f"<DocumentRequirement(program={self.program.name}, stage={self.stage.name}, name={self.name!r})>"


# ----------------------  EXPEDIENTE  ----------------------

class ApplicationDocument(BaseModel):
    """
    Archivo del expediente de una asignación (de internado o de servicio social) para un requisito
    del catálogo. Lo revisa la coordinación: en revisión, aprobado o con observaciones.
    """
    __tablename__ = "application_documents"
    __table_args__ = (
        CheckConstraint(
            "(internship_application_id IS NULL) <> (social_service_application_id IS NULL)",
            name="ck_application_document_single_application",
        ),
        Index("idx_app_doc_internship_application", "internship_application_id"),
        Index("idx_app_doc_social_service_application", "social_service_application_id"),
        Index("idx_app_doc_requirement", "requirement_id"),
    )

    document_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    requirement_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("document_requirements.requirement_id", name="fk_app_doc_requirement"), nullable=False,
    )
    internship_application_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("internship_applications.application_id", name="fk_app_doc_internship_application"),
        nullable=True,
    )
    social_service_application_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("social_service_applications.application_id", name="fk_app_doc_social_service_application"),
        nullable=True,
    )
    path: Mapped[str] = mapped_column(String(1024), nullable=False)
    media_type: Mapped[str] = mapped_column(String(100), nullable=False, default="application/pdf")
    original_filename: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    review_status: Mapped[ReviewStatusEnum] = mapped_column(
        IntEnumType(ReviewStatusEnum), nullable=False, default=ReviewStatusEnum.PENDING,
    )
    review_comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    reviewed_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.user_id", name="fk_app_doc_reviewed_by"), nullable=True,
    )
    uploaded_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.user_id", name="fk_app_doc_uploaded_by"), nullable=True,
    )

    requirement: Mapped["DocumentRequirement"] = relationship(lazy="joined")
    uploaded_by: Mapped[Optional["User"]] = relationship(foreign_keys=[uploaded_by_id], lazy="joined", viewonly=True)

    @property
    def application_id(self) -> int:
        return self.internship_application_id or self.social_service_application_id

    @property
    def uploaded_by_coordination(self) -> bool:
        return bool(self.uploaded_by and self.uploaded_by.is_staff)

    def __repr__(self):
        return f"<ApplicationDocument(requirement_id={self.requirement_id}, status={self.review_status.name})>"
