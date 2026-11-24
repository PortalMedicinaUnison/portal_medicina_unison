"""Operaciones de inscripción comunes al internado y al servicio social (en bloque y del acto público)."""
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

Average = Optional[float]


def _round_average(value: Optional[float]) -> Optional[float]:
    return round(value, 2) if value is not None else None


class AverageField(BaseModel):
    # Promedio general de 0 a 100 con dos decimales (así lo pide la ficha de inscripción).
    average: Average = Field(default=None, ge=0, le=100)

    @field_validator("average")
    @classmethod
    def two_decimals(cls, value: Optional[float]) -> Optional[float]:
        return _round_average(value)


class ApplicationUpdate(AverageField):
    """Datos que la coordinación corrige en una asignación."""


class StudentAssignmentRow(AverageField):
    # Texto libre: un expediente mal escrito se reporta en el resultado, sin rechazar toda la lista.
    academic_id: str = Field(min_length=1, max_length=20)


class BulkAssignmentInput(BaseModel):
    promotion_id: int
    students: List[StudentAssignmentRow] = Field(min_length=1, max_length=1000)


class BulkSkip(BaseModel):
    academic_id: str
    reason: str


class BulkAssignmentResult(BaseModel):
    created: List[str]
    updated: List[str]   # ya estaban asignados: se actualizó su promedio
    skipped: List[BulkSkip]


class PlazaResultRow(BaseModel):
    application_id: int
    site_id: Optional[int] = None   # None: quitar la sede o plaza


class PlazaResultsInput(BaseModel):
    """Resultados del acto público: la sede o plaza que eligió cada estudiante, en el orden en que eligieron."""
    results: List[PlazaResultRow] = Field(min_length=1, max_length=1000)


class PlazaResultOutput(BaseModel):
    application_id: int
    ok: bool
    detail: Optional[str] = None
