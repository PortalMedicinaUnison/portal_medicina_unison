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
    user_id: int

class CheckAuthResponse(BaseModel):
    user_info: UserInfo