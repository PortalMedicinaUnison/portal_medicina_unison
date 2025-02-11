from sqlalchemy import Column, Boolean, Integer, String, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from enum import IntEnum
from .base import AbstractModel
from .types import IntEnumType


# -------------------------------------
# Annoucement models
# -------------------------------------

class Announcement(AbstractModel):
    __tablename__ = 'announcement'
    
    announcement_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(100), nullable=False)
    announcement_type = Column(Integer, nullable=False)
    description = Column(Text)
    
    admin = relationship("User", back_populates="announcements")

# -------------------------------------
# Survey models
# -------------------------------------

class Survey(AbstractModel):
    __tablename__ = 'survey'
    
    survey_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(100), nullable=False)
    web_link = Column(String(200), nullable=False)
    description = Column(Text)
    expiration_date = Column(Date, nullable=False)
    mandatory = Column(Boolean, nullable=False)
    
    admin = relationship("User", back_populates="surveys")

# -------------------------------------
# Report models
# -------------------------------------

class ReportTypeEnum(IntEnum):
    ACCIDENT = 1
    WORK_HARASSMENT = 2
    SEXUAL_HARASSMENT = 3

class Report(AbstractModel):
    __tablename__ = 'report'
    
    report_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    internship_id = Column(Integer, ForeignKey("interships.intership_id"), nullable=False)
    date = Column(Date, nullable=False)
    site = Column(String(50), nullable=False)
    report_type = Column(IntEnumType(ReportTypeEnum), nullable=False)
    other_type = Column(String(50))
    description = Column(Text, nullable=False)
    evidence = Column(String(255))
    anonymity = Column(Boolean, nullable=False)
    status = Column(Integer, nullable=False) 
    
    student = relationship("User", back_populates="reports")
    internship = relationship("Internship", back_populates="reports")