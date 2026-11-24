from datetime import date, datetime, timezone
from typing import Annotated, Optional

from pydantic import AfterValidator, BaseModel, BeforeValidator, ConfigDict, StringConstraints

from utils import validation


class ORMModel(BaseModel):
    """Base de los esquemas de salida: se construyen desde objetos ORM."""
    model_config = ConfigDict(from_attributes=True)


def _as_utc(value: datetime) -> datetime:
    """La BD guarda UTC sin zona; se marca como UTC para que el JSON lleve la zona."""
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


def _blank_to_none(value):
    if isinstance(value, str):
        value = value.strip()
        return value or None
    return value


UTCDateTime = Annotated[datetime, AfterValidator(_as_utc)]

# Textos: se recortan espacios; los obligatorios no pueden quedar vacíos.
def RequiredStr(max_length: int):
    return Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=max_length)]


def OptionalStr(max_length: int):
    return Annotated[
        Optional[Annotated[str, StringConstraints(strip_whitespace=True, max_length=max_length)]],
        BeforeValidator(_blank_to_none),
    ]


Email = Annotated[str, AfterValidator(validation.validate_email)]
Password = Annotated[str, AfterValidator(validation.validate_password)]
AcademicId = Annotated[str, AfterValidator(validation.validate_academic_id)]
Phone = Annotated[Optional[str], BeforeValidator(_blank_to_none), AfterValidator(validation.validate_phone)]
OptionalEmail = Annotated[Optional[str], BeforeValidator(_blank_to_none), AfterValidator(
    lambda v: validation.validate_email(v) if v is not None else None
)]
HttpUrlStr = Annotated[str, AfterValidator(validation.validate_http_url)]
OptionalHttpUrlStr = Annotated[Optional[str], BeforeValidator(_blank_to_none), AfterValidator(
    lambda v: validation.validate_http_url(v) if v is not None else None
)]
FutureOrTodayDate = Annotated[date, AfterValidator(validation.validate_not_past)]
PastOrTodayDate = Annotated[date, AfterValidator(validation.validate_not_future)]
