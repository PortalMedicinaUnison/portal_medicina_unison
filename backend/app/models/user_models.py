from sqlalchemy import Column, Boolean, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class PreRegisteredStudent(Base):
    """
    Estudiantes inscritos por el administrador
    habilitados para registrarse en el portal.
    """

    __tablename__ = "pre_registered_student"

    id = Column(Integer, primary_key=True)
    academic_id = Column(Integer, unique=True, nullable=False, index=True)

class Student(Base):
    """
    Modelo para estudiantes registrados.
    """

    __tablename__ = "student"

    id = Column(Integer, primary_key=True)
    academic_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    paternal_last_name = Column(String(100), nullable=False)
    maternal_last_name = Column(String(100))
    profile_image_path = Column(String(255), unique=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    pre_registered_record = relationship("PreRegisteredStudent", back_populates="student")

class Admin(Base):
    """
    Modelo para administradores.
    """

    __tablename__ = "admin"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    paternal_last_name = Column(String(100), nullable=False)
    maternal_last_name = Column(String(100))
    profile_image_path = Column(String(255), unique=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)