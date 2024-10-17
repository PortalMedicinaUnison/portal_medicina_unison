from pydantic import BaseModel
from typing import List
from fastapi import UploadFile

class StudentRequest(BaseModel):
    student_id: int

class TokenRequest(BaseModel):
    token: str

class AcceptedStudentBase(BaseModel):
    file_number: int

class AcceptedStudentSchema(AcceptedStudentBase):
    id: int

# class QuestionBase(BaseModel):
#     title: str
#     description: str
#     type: str
#     form_id: int
#     # form: FormSchema
# class QuestionSchema(QuestionBase):
#     id: str

# class FormBase(BaseModel):
#     title: str
#     description: str
#     questions: List[QuestionSchema] = []

# class FormSchema(FormBase):
#     id : int
    
# class Question(Base):
#     __tablename__ = "question"

#     id = Column(Integer, primary_key=True)
#     title = Column(String)
#     description = Column(String)
#     type = Column(String)
#     form_id = Column(Integer, ForeignKey('form.id'))
#     form = relationship('Form', back_populates='questions')

class StudentBase(BaseModel):
    name : str = None
    pat_last_name : str = None
    mat_last_name : str = None
    file_number : int = None
    profile_image_path : str = None
    email : str = None
    password : str = None

class StudentSchema(StudentBase):
    id : int

class AdminBase(BaseModel):
    username : str
    email : str
    password : str

class AdminSchema(AdminBase):
    id : int

class UserForm(BaseModel):
    username: str
    password: str
    role: str  # Expecting "student" or "admin"


