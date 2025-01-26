def is_valid_email(email: str) -> bool:
    import re
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(email_regex, email) is not None

def is_valid_password(password: str) -> bool:
    # Por ejemplo: al menos 8 caracteres, una mayúscula, un número y un carácter especial
    return len(password) >= 8 and any(c.isupper() for c in password) and any(c.isdigit() for c in password)

def is_valid_curp(curp: str) -> bool:
    curp_regex = r"^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$"
    return re.match(curp_regex, curp) is not None
