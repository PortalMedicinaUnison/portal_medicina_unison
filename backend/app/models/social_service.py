from enum import IntEnum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import ForeignKey, Index, Integer, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel
from .internship import ApplicationStatusEnum
from .types import IntEnumType

if TYPE_CHECKING:
    from .promotion import Promotion
    from .site import Site
    from .user import User


class SocialServiceStatusEnum(IntEnum):
    ACTIVE = 1
    SUSPENDED = 2
    FINISHED = 3  # liberado


class SocialServiceDocumentTypeEnum(IntEnum):
    ASSIGNMENT_LETTER = 1        # Carta (oficio) de asignación de plaza
    FIRST_REPORT = 2             # Primer informe
    SECOND_REPORT = 3            # Segundo informe
    THIRD_REPORT = 4             # Tercer informe
    FINAL_REPORT = 5             # Informe final
    COMPLETION_CERTIFICATE = 6   # Constancia de terminación (liberación)


# ----------------------  SOCIAL SERVICE APPLICATION  ----------------------

class SocialServiceApplication(BaseModel):
    """
    Asignación de un estudiante a una promoción de servicio social. Solo puede recibirla
    quien ya acreditó el internado; el estudiante la acepta (se crea su servicio social) o la declina.
    """
    __tablename__ = "social_service_applications"
    __table_args__ = (
        UniqueConstraint("promotion_id", "academic_id", name="uq_ss_app_promotion_student"),
        Index("idx_ss_app_academic_status", "academic_id", "status"),
    )

    application_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id"), nullable=False)
    academic_id: Mapped[str] = mapped_column(String(9), ForeignKey("users.academic_id"), nullable=False)
    status: Mapped[ApplicationStatusEnum] = mapped_column(
        IntEnumType(ApplicationStatusEnum), nullable=False, default=ApplicationStatusEnum.PENDING
    )

    promotion: Mapped["Promotion"] = relationship(lazy="joined")
    student: Mapped["User"] = relationship(lazy="joined", viewonly=True)
    social_service: Mapped[Optional["SocialService"]] = relationship(
        primaryjoin="and_(SocialServiceApplication.application_id == SocialService.application_id, SocialService.is_active == True)",
        uselist=False,
        viewonly=True,
    )

    @property
    def social_service_id(self) -> Optional[int]:
        return self.social_service.social_service_id if self.social_service else None

    def __repr__(self):
        return f"<SocialServiceApplication(academic_id={self.academic_id}, promotion_id={self.promotion_id}, status={self.status.name})>"


# ----------------------  SOCIAL SERVICE  ----------------------

class SocialService(BaseModel):
    """Servicio social de un estudiante; se crea al aceptar la asignación. La plaza (sede) la asigna la coordinación."""
    __tablename__ = "social_services"
    __table_args__ = (
        Index("idx_social_service_application", "application_id"),
        Index("idx_social_service_site", "site_id"),
    )

    social_service_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    application_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("social_service_applications.application_id"), unique=True, nullable=False
    )
    site_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=True)
    status: Mapped[SocialServiceStatusEnum] = mapped_column(
        IntEnumType(SocialServiceStatusEnum), nullable=False, default=SocialServiceStatusEnum.ACTIVE
    )

    application: Mapped["SocialServiceApplication"] = relationship(lazy="joined")
    site: Mapped[Optional["Site"]] = relationship(lazy="joined")
    documents: Mapped[List["SocialServiceDocument"]] = relationship(back_populates="social_service")

    @property
    def academic_id(self) -> str:
        return self.application.academic_id

    @property
    def promotion_id(self) -> int:
        return self.application.promotion_id

    def __repr__(self):
        return f"<SocialService(social_service_id={self.social_service_id}, site_id={self.site_id}, status={self.status.name})>"


# ----------------------  SOCIAL SERVICE DOCUMENT  ----------------------

class SocialServiceDocument(BaseModel):
    """Documento PDF del servicio social. Solo puede haber uno activo por tipo."""
    __tablename__ = "social_service_documents"
    __table_args__ = (
        Index(
            "uq_active_ss_doc_per_type",
            "social_service_id", "document_type",
            unique=True,
            sqlite_where=text("is_active = 1"),
            postgresql_where=text("is_active"),
        ),
    )

    document_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    social_service_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("social_services.social_service_id"), nullable=False
    )
    document_type: Mapped[SocialServiceDocumentTypeEnum] = mapped_column(
        IntEnumType(SocialServiceDocumentTypeEnum), nullable=False
    )
    path: Mapped[str] = mapped_column(String(1024), nullable=False)
    media_type: Mapped[str] = mapped_column(String(100), nullable=False, default="application/pdf")
    original_filename: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    social_service: Mapped["SocialService"] = relationship(back_populates="documents")

    def __repr__(self):
        return f"<SocialServiceDocument(social_service_id={self.social_service_id}, document_type={self.document_type.name})>"
