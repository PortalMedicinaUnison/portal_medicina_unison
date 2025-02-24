from pydantic import BaseModel

class AdminBase(BaseModel):
    username : str
    email : str
    password : str

class AdminSchema(AdminBase):
    id : int