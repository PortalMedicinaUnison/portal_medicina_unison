from pydantic import BaseModel


class LoginForm(BaseModel):
    username: str
    password: str

class TokenRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str