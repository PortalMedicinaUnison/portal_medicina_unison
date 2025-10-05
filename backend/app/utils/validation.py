from datetime import date

def is_valid_email(email: str) -> bool:
    import re
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(email_regex, email) is not None

def is_valid_password(password: str) -> bool:
    # Por ejemplo: al menos 8 caracteres, una mayúscula, un número y un carácter especial
    return len(password) >= 8 and any(c.isupper() for c in password) and any(c.isdigit() for c in password)

def is_valid_academic_id(id: str) -> None:
    """    
    Valida que un ID de estudiante sea una cadena donde:
    - Todos los caracteres son números enteros.
    - La longitud de la cadena es exactamente 9.
    - El primer carácter es '2'.
    """
    if not id.isdigit():
        raise ValueError("El expediente debe contener solo números")

    if len(id) != 9:
        raise ValueError("El expediente debe tener una longitud de 9 caracteres.")
    
    if id[0] != '2':
        raise ValueError("El expediente esta fuera de rango.")

def is_valid_phone(phone: str) -> None:
    """
    Valida que un número de teléfono tenga el formato correcto.
    """
    if not phone.isdigit():
        raise ValueError("El número de teléfono debe contener solo números")
    if len(phone) != 10:
        raise ValueError("El número de teléfono debe tener una longitud de 10 caracteres.")

    
def is_valid_period(period: int) -> None:
    """
    Valida que el periodo sea un número 1 o 2, correspondiente 
    a la primera o segunda promoción del año.
    """
    if period not in [1, 2]:
        raise ValueError("El periodo debe ser 1 o 2.")
    
def is_valid_future_date(input_date: date) -> None:
    """
    Valida que la fecha igual o futura a la actual.
    """
    if input_date < date.today():
        raise ValueError("La fecha debe ser igual o futura a la actual.")
    
def is_valid_past_date(date: date) -> None:
    """
    Valida que la fecha sea igual o anterior a la actual.
    """
    if date > date.today():
        raise ValueError("La fecha debe ser igual o anterior a la actual.")
    
def is_valid_year(year: int) -> None:
    """
    Valida que el año de la pasantía no pueda ser menor al actual.
    """
    if year < date.today().year:
        raise ValueError("El año de la pasantía no puede ser menor al actual.")
    
def is_valid_capacity(capacity: int) -> None:
    """
    Valida que la capacidad sea un número entero positivo.
    """
    if capacity < 0:
        raise ValueError("La capacidad debe ser un número entero positivo.")
    
def is_valid_other_type_report(other_type: str, report_type: str) -> None:
    """
    Valida que el campo de tipo personalizado no exceda los 50 caracteres
    """
    if len(other_type) > 25:
        raise ValueError("El tipo personalizado no puede exceder 50 caracteres")