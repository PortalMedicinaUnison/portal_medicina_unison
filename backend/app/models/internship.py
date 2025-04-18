from sqlalchemy import Boolean, Integer, String,Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType


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

class InternshipEnrollment(BaseModel):
    __tablename__ = 'internship_enrollments'
    
    enrollment_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    is_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False)

    def __repr__(self):
        return f"<InternshipEnrollment(student_id={self.student_id}, is_accepted={self.is_accepted})>"

class Internship(BaseModel):
    __tablename__ = 'internships'
    __table_args__ = (
        Index('idx_internship_user', 'student_id'),
        Index('idx_internship_site', 'site_id'),
    )

    internship_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[InternshipStatusEnum] = mapped_column(IntEnumType(InternshipStatusEnum), nullable=False)
    enrollment_id: Mapped[int] = mapped_column(Integer, ForeignKey("internship_enrollments.enrollment_id", ondelete="RESTRICT"), nullable=False)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id", ondelete="RESTRICT"), nullable=False)

    def __repr__(self):
        return f"<Internship(student_id={self.student_id}, site={self.site_id}, year={self.year}, period={self.period}, status={self.status.name})>"

class InternshipDocument(BaseModel):
    __tablename__ = 'internship_documents'
    
    document_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    internship_id: Mapped[int] = mapped_column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    document_type: Mapped[DocumentTypeEnum] = mapped_column(IntEnumType(DocumentTypeEnum), nullable=False)
    path: Mapped[str] = mapped_column(String(255), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    def __repr__(self):
        return f"<InternshipDocument(internship_id={self.internship_id}, document_type={self.document_type.name}, is_verified={self.is_verified})>"