from pydantic import BaseModel


class LoginForm(BaseModel):
    email: str
    password: str

class TokenRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserInfo(BaseModel):
    email: str
    role: str

class CheckAuthResponse(BaseModel):
    status: str
    user_info: UserInfo