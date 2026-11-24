from datetime import date
from typing import Annotated, List, Optional

from pydantic import AfterValidator, BaseModel, Field, model_validator

from models.promotion import ProgramEnum, date_range_problem
from schemas.common import ORMModel
from schemas.site import SiteBasicOutput
from utils.dates import local_today
from utils.validation import validate_period, validate_year


def _validate_new_year(year: int) -> int:
    validate_year(year)
    if year < local_today().year:
        raise ValueError("El año de la promoción no puede ser anterior al actual.")
    return year


Period = Annotated[int, AfterValidator(validate_period)]
Year = Annotated[int, AfterValidator(validate_year)]
NewYear = Annotated[int, AfterValidator(_validate_new_year)]
Capacity = Annotated[int, Field(ge=1, le=1000)]


# ---------------------- PROMOTIONS ----------------------

def _check_dates(start: Optional[date], end: Optional[date]) -> None:
    problem = date_range_problem(start, end)
    if problem:
        raise ValueError(problem)


def _check_start(start: Optional[date], allow_past: bool) -> None:
    if start is None:
        return
    this_year = local_today().year
    if not allow_past and start.year < this_year:
        raise ValueError("La promoción no puede empezar antes del año actual.")
    if not 2000 <= start.year <= this_year + 5:
        raise ValueError("La fecha de inicio no es válida.")


class PromotionInput(BaseModel):
    """
    Basta la fecha de inicio: el término se propone a doce meses y el año y el periodo se derivan.
    Por compatibilidad se acepta año y periodo en lugar de fechas (se usan las fechas habituales).
    """
    program: ProgramEnum = ProgramEnum.INTERNSHIP
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    year: Optional[NewYear] = None
    period: Optional[Period] = None
    is_finished: bool = False

    @model_validator(mode="after")
    def start_or_period(self):
        if self.start_date is None and (self.year is None or self.period is None):
            raise ValueError("Indica la fecha de inicio de la promoción.")
        _check_start(self.start_date, allow_past=False)
        _check_dates(self.start_date, self.end_date)
        return self


class PromotionUpdate(BaseModel):
    start_date: date = None
    end_date: date = None
    year: Year = None
    period: Period = None
    is_finished: bool = None

    @model_validator(mode="after")
    def valid_range(self):
        _check_start(self.start_date, allow_past=True)  # al editar se admiten promociones de años anteriores
        _check_dates(self.start_date, self.end_date)
        return self


class PromotionOutput(ORMModel):
    promotion_id: int
    program: ProgramEnum
    year: int
    period: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    label: str
    is_finished: bool


# ---------------------- PROMOTION SITE DETAIL ----------------------

class PromotionSiteDetailInput(BaseModel):
    promotion_id: int
    site_id: int
    capacity: Capacity


class PromotionSiteDetailUpdate(BaseModel):
    capacity: Capacity


class PromotionSiteDetailOutput(ORMModel):
    psd_id: int
    promotion_id: int
    site_id: int
    capacity: int
    occupied: int = 0
    site: SiteBasicOutput


class SeatRow(BaseModel):
    site_id: int
    capacity: int = Field(ge=0, le=1000)   # 0 = la sede deja de tener cupo en la promoción


class SeatsInput(BaseModel):
    """Cupos de varias sedes a la vez; las sedes que no se envían no cambian."""
    seats: List[SeatRow] = Field(max_length=1000)

