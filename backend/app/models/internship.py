from enum import IntEnum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel
from .types import IntEnumType

if TYPE_CHECKING:
    from .promotion import Promotion
    from .site import Site
    from .user import User


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
    (se crea su internado) o la declina. Es también su expediente (ver models/document.py).
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

    @property
    def academic_id(self) -> str:
        return self.application.academic_id

    @property
    def promotion_id(self) -> int:
        return self.application.promotion_id

    def __repr__(self):
        return f"<Internship(internship_id={self.internship_id}, site_id={self.site_id}, status={self.status.name})>"

