from sqlalchemy import Boolean, Integer, String, Index, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import IntEnum
from .base import BaseModel
from .promotion import Promotion
from .types import IntEnumType


# ----------------------  INTERNSHIP APPLICATION  ----------------------

class DocumentTypeEnum(IntEnum):
    BITACORA = 1
    COMPLETION_LETTER = 2
    KARDEX = 3
    CERTIFICATE = 4
    OTHER = 5

class InternshipStatusEnum(IntEnum):
    PENDING = 1
    ACCEPTED = 2
    REJECTED = 3
    SUSPENDED = 4
    FINISHED = 5

class ApplicationStatusEnum(IntEnum):
    PENDING = 1
    ACCEPTED = 2
    DECLINED = 3

class InternshipApplication(BaseModel):
    __tablename__ = 'internship_applications'
    __table_args__ = (
        UniqueConstraint('promotion_id', 'academic_id', name='uq_app_promotion_student'),
        Index('idx_app_academic_status', 'academic_id', 'status'),
    )
    
    application_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id"), nullable=False)
    academic_id: Mapped[str] = mapped_column(String(9), ForeignKey("users.academic_id", ondelete="CASCADE"), nullable=False)
    status: Mapped[ApplicationStatusEnum] = mapped_column(IntEnumType(ApplicationStatusEnum), nullable=False, default=ApplicationStatusEnum.PENDING)

    promotion: Mapped["Promotion"] = relationship("Promotion", lazy="joined")

    def __repr__(self):
        return f"<InternshipApplication(academic_id={self.academic_id}, promotion_id={self.promotion_id}, status={self.status.name})>"

# ----------------------  INTERNSHIP  ----------------------

class Internship(BaseModel):
    __tablename__ = 'internships'
    __table_args__ = (
        Index('idx_internship_user', 'academic_id'),
        Index('idx_internship_site', 'site_id'),
        UniqueConstraint('promotion_id', 'academic_id', name='uq_app_promotion_student'),
    )

    internship_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id"), nullable=False)
    application_id: Mapped[int] = mapped_column(Integer, ForeignKey("internship_applications.application_id", ondelete="RESTRICT"), unique=True, nullable=False)
    academic_id: Mapped[str] = mapped_column(String(9), ForeignKey("users.academic_id", ondelete="CASCADE"), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id", ondelete="RESTRICT"), nullable=False)
    status: Mapped[InternshipStatusEnum] = mapped_column(IntEnumType(InternshipStatusEnum), nullable=False)

    def __repr__(self):
        return (f"<Internship(academic_id={self.academic_id}, site_id={self.site_id}, promotion_id={self.promotion_id}, status={self.status.name})>")

# ----------------------  INTERNSHIP DOCUMENT  ----------------------

class InternshipDocument(BaseModel):
    __tablename__ = 'internship_documents'
    
    document_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    internship_id: Mapped[int] = mapped_column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    document_type: Mapped[DocumentTypeEnum] = mapped_column(IntEnumType(DocumentTypeEnum), nullable=False)
    path: Mapped[str] = mapped_column(String(255), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    def __repr__(self):
        return f"<InternshipDocument(internship_id={self.internship_id}, document_type={self.document_type.name}, is_verified={self.is_verified})>"