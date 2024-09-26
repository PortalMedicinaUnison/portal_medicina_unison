from sqlalchemy import Column, Integer, String, Float
from db.database import Base

class Student(Base):
    __tablename__ = "student"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    pat_last_name = Column(String)
    mat_last_name = Column(String)
    file_number = Column(Integer, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
