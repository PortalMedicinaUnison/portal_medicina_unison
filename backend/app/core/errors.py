"""
Errores HTTP con mensajes en español y manejadores globales.

Todas las respuestas de error tienen la forma {"detail": "<mensaje legible>"}; los 422
incluyen además "errors" con el detalle de Pydantic.
"""
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError


def bad_request(message: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)


def unauthorized(message: str = "Debes iniciar sesión.") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )


def forbidden(message: str = "No tienes permisos para realizar esta acción.") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=message)


def not_found(message: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)


def conflict(message: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=message)


def payload_too_large(message: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail=message)


# ---------------------- VALIDACIÓN (422) ----------------------

FIELD_LABELS = {
    "academic_id": "Expediente", "academic_ids": "Expedientes",
    "first_name": "Nombre", "last_name": "Apellido paterno", "second_last_name": "Apellido materno",
    "email": "Correo", "phone_number": "Teléfono",
    "password": "Contraseña", "current_password": "Contraseña actual",
    "new_password": "Nueva contraseña", "confirm_password": "Confirmación de contraseña",
    "name": "Nombre", "institution_id": "Institución", "address": "Dirección", "city": "Municipio",
    "teaching_head_name": "Jefe de enseñanza", "teaching_head_email": "Correo del jefe de enseñanza",
    "teaching_head_phone": "Teléfono del jefe de enseñanza", "teaching_deputy_name": "Subjefe de enseñanza",
    "teaching_deputy_email": "Correo del subjefe de enseñanza", "teaching_deputy_phone": "Teléfono del subjefe de enseñanza",
    "year": "Año", "period": "Periodo", "is_finished": "Finalizada",
    "promotion_id": "Promoción", "site_id": "Sede", "capacity": "Capacidad", "status": "Estatus",
    "document_type": "Tipo de documento", "file": "Archivo",
    "title": "Título", "description": "Descripción", "announcement_type": "Tipo de aviso",
    "is_visible": "Visible", "url": "URL", "expiration_date": "Fecha de expiración", "mandatory": "Obligatoria",
    "date_report": "Fecha del reporte", "report_type": "Tipo de reporte", "other_type": "Otro tipo",
    "evidence_url": "Evidencia", "anonymity": "Anonimato", "is_open": "Abierto",
    "token": "Enlace", "accept_privacy_notice": "Aviso de privacidad",
    "program": "Programa", "stage": "Etapa", "is_required": "Obligatorio", "allows_multiple": "Varios archivos",
    "validity_months": "Vigencia (meses)", "sort_order": "Orden", "requirement_id": "Documento",
    "review_status": "Revisión", "review_comment": "Observaciones",
    "average": "Promedio", "students": "Alumnos", "application_id": "Inscripción",
    "start_date": "Fecha de inicio", "end_date": "Fecha de término", "seats": "Cupos",
    "for_internship": "Sede de internado", "for_social_service": "Sede de servicio social",
}

ERROR_MESSAGES = {
    "missing": "es obligatorio.",
    "int_parsing": "debe ser un número entero.",
    "int_type": "debe ser un número entero.",
    "int_from_float": "debe ser un número entero.",
    "bool_parsing": "debe ser verdadero o falso.",
    "bool_type": "debe ser verdadero o falso.",
    "string_type": "debe ser texto.",
    "string_too_short": "no puede estar vacío.",
    "string_too_long": "es demasiado largo (máximo {max_length} caracteres).",
    "date_parsing": "no es una fecha válida (AAAA-MM-DD).",
    "date_from_datetime_parsing": "no es una fecha válida (AAAA-MM-DD).",
    "date_type": "no es una fecha válida (AAAA-MM-DD).",
    "enum": "tiene un valor no permitido.",
    "greater_than_equal": "debe ser mayor o igual a {ge}.",
    "less_than_equal": "debe ser menor o igual a {le}.",
    "too_short": "debe tener al menos {min_length} elementos.",
    "too_long": "debe tener como máximo {max_length} elementos.",
    "list_type": "debe ser una lista.",
    "model_attributes_type": "tiene un formato inválido.",
    "dict_type": "tiene un formato inválido.",
    "json_invalid": "El cuerpo de la petición no es JSON válido.",
}


def _format_error(error: dict) -> str:
    loc = [part for part in error.get("loc", ()) if part not in ("body", "query", "path", "form")]
    field = next((part for part in reversed(loc) if isinstance(part, str)), None)
    error_type = error.get("type", "")
    ctx = error.get("ctx") or {}

    if error_type == "value_error":
        # Mensaje propio de nuestras validaciones (ValueError): "Value error, <mensaje>"
        message = str(error.get("msg", "")).removeprefix("Value error, ")
        return message
    if error_type == "json_invalid":
        return ERROR_MESSAGES["json_invalid"]

    template = ERROR_MESSAGES.get(error_type)
    try:
        message = template.format(**ctx) if template else error.get("msg", "valor inválido.")
    except (KeyError, IndexError):
        message = template or error.get("msg", "valor inválido.")
    label = FIELD_LABELS.get(field, field) if field else None
    return f"{label}: {message}" if label else message


async def validation_exception_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
    messages = []
    for error in exc.errors():
        message = _format_error(error)
        if message and message not in messages:
            messages.append(message)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={"detail": " ".join(messages) or "Los datos enviados no son válidos.", "errors": jsonable_encoder(exc.errors())},
    )


async def integrity_error_handler(_request: Request, _exc: IntegrityError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": "La operación entra en conflicto con datos existentes (registro duplicado o referencia inválida)."},
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(IntegrityError, integrity_error_handler)
