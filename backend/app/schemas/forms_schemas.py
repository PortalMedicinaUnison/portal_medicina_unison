from pydantic import BaseModel
from typing import List


class QuestionBase(BaseModel):
    title: str
    description: str
    type: str
    form_id: int
    # form: FormSchema
class QuestionSchema(QuestionBase):
    id: str

class FormBase(BaseModel):
    title: str
    description: str
    questions: List[QuestionSchema] = []

class FormSchema(FormBase):
    id : int
    
class Question(Base):
    __tablename__ = "question"

    id = Column(Integer, primary_key=True)
    title: str
    description: str
    type: str
    form_id = Column(Integer, ForeignKey('form.id'))
    form = relationship('Form', back_populates='questions')