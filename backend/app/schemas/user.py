from pydantic import BaseModel


class TokenRequest(BaseModel):
    token: str

class UserForm(BaseModel):
    username: str
    password: str
    role: str  # Expecting "student" or "admin"