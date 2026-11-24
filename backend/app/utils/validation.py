"""
Validaciones reutilizables. Todas lanzan ValueError con un mensaje en español
(Pydantic lo convierte en un error 422) y devuelven el valor normalizado.
"""
import re
from datetime import date
from typing import Optional

from pydantic import HttpUrl, TypeAdapter

from utils.dates import local_today

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$")
_http_url_adapter = TypeAdapter(HttpUrl)


def validate_email(email: str) -> str:
    email = email.strip().lower()
    if not EMAIL_REGEX.match(email):
        raise ValueError("El correo electrónico no es válido.")
    return email


def validate_password(password: str) -> str:
    """Al menos 8 caracteres, una mayúscula y un número (máximo 72 bytes, límite de bcrypt)."""
    if len(password) < 8:
        raise ValueError("La contraseña debe tener al menos 8 caracteres.")
    if len(password.encode("utf-8")) > 72:
        raise ValueError("La contraseña es demasiado larga (máximo 72 caracteres).")
    if not any(c.isupper() for c in password):
        raise ValueError("La contraseña debe incluir al menos una letra mayúscula.")
    if not any(c.isdigit() for c in password):
        raise ValueError("La contraseña debe incluir al menos un número.")
    return password


def validate_academic_id(academic_id: str) -> str:
    """Expediente: 9 dígitos que empiezan con 2."""
    academic_id = academic_id.strip()
    if not academic_id.isdigit():
        raise ValueError("El expediente debe contener solo números.")
    if len(academic_id) != 9:
        raise ValueError("El expediente debe tener 9 dígitos.")
    if academic_id[0] != "2":
        raise ValueError("El expediente debe empezar con 2.")
    return academic_id


def validate_phone(phone: Optional[str]) -> Optional[str]:
    """Teléfono opcional de 10 dígitos."""
    if phone is None or not phone.strip():
        return None
    phone = phone.strip()
    if not phone.isdigit() or len(phone) != 10:
        raise ValueError("El teléfono debe tener 10 dígitos.")
    return phone


def validate_period(period: int) -> int:
    """1 o 2: primera o segunda promoción del año."""
    if period not in (1, 2):
        raise ValueError("El periodo debe ser 1 o 2.")
    return period


def validate_year(year: int) -> int:
    if year < 2000 or year > local_today().year + 5:
        raise ValueError("El año no es válido.")
    return year


def validate_not_past(value: date) -> date:
    if value < local_today():
        raise ValueError("La fecha no puede ser anterior a hoy.")
    return value


def validate_not_future(value: date) -> date:
    if value > local_today():
        raise ValueError("La fecha no puede ser posterior a hoy.")
    return value


def validate_http_url(value: str) -> str:
    try:
        return str(_http_url_adapter.validate_python(value.strip()))
    except Exception:
        raise ValueError("La URL no es válida (debe empezar con http:// o https://).")
