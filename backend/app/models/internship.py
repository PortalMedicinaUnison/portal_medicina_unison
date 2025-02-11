from sqlalchemy import Column, Boolean, Integer, String,Index, ForeignKey, DateTime
from sqlalchemy.orm import relationship
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
    
    enrollment_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    is_accepted = Column(Boolean, nullable=False)
    
    student = relationship("User", back_populates="internship_enrollments")
    internship = relationship("Internship", back_populates="enrollment", uselist=False)

    def __repr__(self):
        return f"<InternshipEnrollment(student_id={self.student_id}, is_accepted={self.is_accepted})>"

class Internship(BaseModel):
    __tablename__ = 'internships'
    
    internship_id = Column(Integer, primary_key=True, autoincrement=True)
    enrollment_id = Column(Integer, ForeignKey("internship_enrollments.enrollment_id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    site_id = Column(Integer, ForeignKey("sites.site_id"), nullable=False)
    year = Column(Integer, nullable=False)
    period = Column(Integer, nullable=False)
    status = Column(IntEnumType(InternshipStatusEnum), nullable=False)
    
    __table_args__ = (
        Index('idx_internship_user', 'student_id'),
        Index('idx_internship_site', 'site_id'),
    )

    enrollment = relationship("InternshipEnrollment", back_populates="internship")
    student = relationship("User", back_populates="internship")
    site = relationship("Site", back_populates="internship")
    documents = relationship("InternshipDocument", back_populates="internship")
    reports = relationship("Report", back_populates="internship")

    def __repr__(self):
        return f"<Internship(student_id={self.student_id}, site={self.site_id}, year={self.year}, period={self.period}, status={self.status.name})>"


class InternshipDocument(BaseModel):
    __tablename__ = 'internship_documents'
    
    document_id = Column(Integer, primary_key=True, autoincrement=True)
    internship_id = Column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    document_type = Column(IntEnumType(DocumentTypeEnum), nullable=False)
    path = Column(String(255), nullable=False)
    is_verified = Column(Boolean, nullable=False)
    
    internship = relationship("Internship", back_populates="documents")

    def __repr__(self):
        return f"<InternshipDocument(internship_id={self.internship_id}, document_type={self.document_type.name}, verification_status={self.verification_status})>"