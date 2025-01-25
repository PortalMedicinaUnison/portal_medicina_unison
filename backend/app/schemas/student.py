from pydantic import BaseModel
from typing import List

class StudentRequest(BaseModel):
    student_id: int


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

class PreRegisteredStudentBase(BaseModel):
    file_number: int

class PreRegisteredStudentSchema(PreRegisteredStudentBase):
    id: int