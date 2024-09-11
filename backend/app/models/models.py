from sqlalchemy import Column, Integer, String, Float
from db.database import Base
from pydantic import BaseModel

class Item(Base):
    __tablename__ = "student"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    pat_last_name = Column(String)
    mat_last_name = Column(String)
    file_number = Column(Integer, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

class ItemCreate(BaseModel):
    name : str
    pat_last_name : str
    mat_last_name : str
    file_number : int
    email : str
    password : str

class ItemResponse(BaseModel):
    id: int
    name: str
    color: str
    weight: int
