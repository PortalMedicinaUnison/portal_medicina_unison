from sqlalchemy import Column, Boolean, Integer, String,Index, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from enum import IntEnum
from .base import AbstractModel
from .types import IntEnumType


class DocumentTypeEnum(IntEnum):
    BITACORA = 1
    COMPLETION_LETTER = 2
    KARDEX = 3
    CERTIFICATE = 4
    OTHER = 5

class InternshipEnrollment(AbstractModel):
    __tablename__ = 'internship_enrollments'
    
    enrollment_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    is_accepted = Column(Boolean, nullable=False)
    
    student = relationship("User", back_populates="internship_enrollments")
    internship = relationship("Internship", back_populates="enrollment", uselist=False)


class Internship(AbstractModel):
    __tablename__ = 'internships'
    
    internship_id = Column(Integer, primary_key=True, autoincrement=True)
    enrollment_id = Column(Integer, ForeignKey("internship_enrollments.enrollment_id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    site_id = Column(Integer, ForeignKey("sites.site_id"), nullable=False)
    year = Column(Integer, nullable=False)
    period = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False)
    is_finished = Column(Boolean, nullable=False)
    
    __table_args__ = (
        Index('idx_internship_user', 'student_id'),
        Index('idx_internship_site', 'site_id'),
    )

    enrollment = relationship("InternshipEnrollment", back_populates="internship")
    student = relationship("User", back_populates="internship")
    site = relationship("Site", back_populates="internship")
    documents = relationship("InternshipDocument", back_populates="internship")
    reports = relationship("Report", back_populates="internship")


class InternshipDocument(AbstractModel):
    __tablename__ = 'internship_documents'
    
    document_id = Column(Integer, primary_key=True, autoincrement=True)
    internship_id = Column(Integer, ForeignKey("internships.internship_id"), nullable=False)
    document_type = Column(IntEnumType(DocumentTypeEnum), nullable=False)
    path = Column(String(255), nullable=False)
    verification_status = Column(Boolean, nullable=False)
    submission_date = Column(DateTime, nullable=False)
    
    internship = relationship("Internship", back_populates="documents")