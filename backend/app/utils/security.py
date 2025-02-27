import bcrypt
import jwt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password.encode())

def get_user_role(user) -> str:
    if user.is_super_admin:
        return "super_admin"
    elif user.is_admin:
        return "admin"
    else:
        return "student"