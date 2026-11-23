from enum import IntEnum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import ForeignKey, Index, Integer, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel
from .types import IntEnumType

if TYPE_CHECKING:
    from .promotion import Promotion
    from .site import Site
    from .user import User


class DocumentTypeEnum(IntEnum):
    BITACORA = 1
    COMPLETION_LETTER = 2
    KARDEX = 3
    CERTIFICATE = 4


class InternshipStatusEnum(IntEnum):
    ACTIVE = 1
    SUSPENDED = 2
    FINISHED = 3


class ApplicationStatusEnum(IntEnum):
    PENDING = 1
    ACCEPTED = 2
    DECLINED = 3


# ----------------------  INTERNSHIP APPLICATION  ----------------------

class InternshipApplication(BaseModel):
    """
    Asignación de un estudiante a una promoción. El estudiante la acepta
    (se crea su internado) o la declina.
    """
    __tablename__ = "internship_applications"
    __table_args__ = (
        UniqueConstraint("promotion_id", "academic_id", name="uq_app_promotion_student"),
        Index("idx_app_academic_status", "academic_id", "status"),
    )

    application_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id"), nullable=False)
    academic_id: Mapped[str] = mapped_column(String(9), ForeignKey("users.academic_id"), nullable=False)
    status: Mapped[ApplicationStatusEnum] = mapped_column(
        IntEnumType(ApplicationStatusEnum), nullable=False, default=ApplicationStatusEnum.PENDING
    )

    promotion: Mapped["Promotion"] = relationship(lazy="joined")
    student: Mapped["User"] = relationship(lazy="joined", viewonly=True)
    internship: Mapped[Optional["Internship"]] = relationship(
        primaryjoin="and_(InternshipApplication.application_id == Internship.application_id, Internship.is_active == True)",
        uselist=False,
        viewonly=True,
    )

    @property
    def internship_id(self) -> Optional[int]:
        return self.internship.internship_id if self.internship else None

    def __repr__(self):
        return f"<InternshipApplication(academic_id={self.academic_id}, promotion_id={self.promotion_id}, status={self.status.name})>"


# ----------------------  INTERNSHIP  ----------------------

class Internship(BaseModel):
    """Internado de un estudiante; se crea al aceptar la asignación. La sede la asigna el administrador."""
    __tablename__ = "internships"
    __table_args__ = (
        Index("idx_internship_application", "application_id"),
        Index("idx_internship_site", "site_id"),
    )

    internship_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    application_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("internship_applications.application_id"), unique=True, nullable=False
    )
    site_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=True)
    status: Mapped[InternshipStatusEnum] = mapped_column(
        IntEnumType(InternshipStatusEnum), nullable=False, default=InternshipStatusEnum.ACTIVE
    )

    application: Mapped["InternshipApplication"] = relationship(lazy="joined")
    site: Mapped[Optional["Site"]] = relationship(lazy="joined")
    documents: Mapped[List["InternshipDocument"]] = relationship(back_populates="internship")

    @property
    def academic_id(self) -> str:
        return self.application.academic_id

    @property
    def promotion_id(self) -> int:
        return self.application.promotion_id

    def __repr__(self):
        return f"<Internship(internship_id={self.internship_id}, site_id={self.site_id}, status={self.status.name})>"


# ----------------------  INTERNSHIP DOCUMENT  ----------------------

class InternshipDocument(BaseModel):
    """Documento PDF del internado. Solo puede haber uno activo por tipo."""
    __tablename__ = "internship_documents"
    __table_args__ = (
        Index(
            "uq_active_doc_per_type",
            "internship_id", "document_type",
            unique=True,
            sqlite_where=text("is_active = 1"),
            postgresql_where=text("is_active"),
        ),
    )

    document_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    internship_id: Mapped[int] = mapped_column(Integer, ForeignKey("internships.internship_id"), nullable=False)
    document_type: Mapped[DocumentTypeEnum] = mapped_column(IntEnumType(DocumentTypeEnum), nullable=False)
    path: Mapped[str] = mapped_column(String(1024), nullable=False)
    media_type: Mapped[str] = mapped_column(String(100), nullable=False, default="application/pdf")
    original_filename: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    internship: Mapped["Internship"] = relationship(back_populates="documents")

    def __repr__(self):
        return f"<InternshipDocument(internship_id={self.internship_id}, document_type={self.document_type.name})>"
