from sqlalchemy import Column, Boolean, Integer, String, Index, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel


class PreRegisteredUser(BaseModel):
    """
    Estudiantes inscritos por el administrador
    habilitados para registrarse en el portal.
    De esta manera solo los estudiantes que cumplen
    con los requisitos pueden registrarse.

    """

    __tablename__ = "pre_registered_users"

    pre_registered_id = Column(Integer, primary_key=True, autoincrement=True)
    academic_id = Column(Integer, unique=True, nullable=False)
    assigned_year = Column(Integer, nullable=False)
    assigned_period = Column(Integer, nullable=False)
    
    __table_args__ = (Index('idx_pre_registered_academic_id', 'academic_id'),)
    
    user = relationship("User", back_populates="pre_registered", uselist=False) # cardinality 1:1

    def __repr__(self):
        return f"<PreRegisteredUser(academic_id={self.academic_id}, is_active={self.is_active})>"

class User(BaseModel):
    
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    academic_id = Column(Integer, ForeignKey("pre_registered_users.academic_id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    second_last_name = Column(String(50), nullable=True)
    email = Column(String(50), nullable=False, unique=True)
    password = Column(String, nullable=False)
    profile_photo = Column(String(255), nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)
    is_super_admin = Column(Boolean, nullable=False, default=False)
    
    __table_args__ = (Index('idx_user_email', 'email'),)
    
    pre_registered = relationship("PreRegisteredUser", back_populates="user")
    announcements = relationship("Announcement", back_populates="admin")
    surveys = relationship("Survey", back_populates="admin")
    sites = relationship("Site", back_populates="admin")
    reports = relationship("Report", back_populates="student")
    internship_enrollments = relationship("InternshipEnrollment", back_populates="student")
    internship = relationship("Internship", back_populates="student")

    def __repr__(self):
        return f"<User(name={self.first_name}, email={self.email}, is_admin={self.is_admin}, is_active={self.is_active})>"