from sqlalchemy import Column, Boolean, Integer, String, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from enum import IntEnum
from .base import BaseModel
from .types import IntEnumType


# ---------------  Announcement  ----------------------

class AnnouncementTypeEnum(IntEnum):
    GENERAL = 1
    INTERNSHIP = 2

class Announcement(BaseModel):
    __tablename__ = 'announcement'
    
    announcement_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    announcement_type = Column(IntEnumType(AnnouncementTypeEnum), nullable=False)
    description = Column(Text)
    
    admin = relationship("User", back_populates="announcements")

    def __repr__(self):
        return f"<Announcement(admin_id={self.admin_id}, title={self.title}, announcement_type={self.announcement_type.name})>"


# ---------------  Survey  ----------------------

class Survey(BaseModel):
    __tablename__ = 'survey'
    
    survey_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    web_link = Column(String(200), nullable=False)
    description = Column(Text)
    expiration_date = Column(Date, nullable=False)
    mandatory = Column(Boolean, nullable=False)
    
    admin = relationship("User", back_populates="surveys")

    def __repr__(self):
        return f"<Survey(admin_id={self.admin_id}, title={self.title}, mandatory={self.mandatory})>"

# ---------------  Survey  ----------------------

class ReportTypeEnum(IntEnum):
    ACCIDENT = 1
    WORK_HARASSMENT = 2
    SEXUAL_HARASSMENT = 3

class Report(BaseModel):
    __tablename__ = 'report'
    
    report_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    site = Column(String(50), nullable=False)
    report_type = Column(IntEnumType(ReportTypeEnum), nullable=False)
    other_type = Column(String(50))
    description = Column(Text, nullable=False)
    evidence = Column(String(255))
    anonymity = Column(Boolean, nullable=False)
    is_open = Column(Boolean, nullable=False, default=True)
    admin_comment = Column(Text)
    
    student = relationship("User", back_populates="reports")
    internship = relationship("Internship", back_populates="reports")

    def __repr__(self):
        return f"<Report(student_id={self.student_id}, type={self.report_type.name}, is_open={self.is_open})>"