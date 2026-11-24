from datetime import date, timedelta
from enum import IntEnum
from typing import TYPE_CHECKING, Optional, Tuple

from sqlalchemy import Boolean, Date, ForeignKey, Index, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import BaseModel
from .types import IntEnumType

if TYPE_CHECKING:
    from .site import Site


class ProgramEnum(IntEnum):
    """Programa que acredita el estudiante: primero el internado y después el servicio social."""
    INTERNSHIP = 1
    SOCIAL_SERVICE = 2


MONTH_ABBR = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
# Mes de inicio habitual por periodo (1 = primera, 2 = segunda del año): internado 1 de enero o
# 1 de julio; servicio social 1 de febrero o 1 de agosto (Lineamientos del servicio social, art. 9).
DEFAULT_START_MONTH = {1: {1: 1, 2: 7}, 2: {1: 2, 2: 8}}


def period_of(start: date) -> int:
    return 1 if start.month <= 6 else 2


def one_year_after(start: date) -> date:
    """Último día de un programa de doce meses que empieza en `start`."""
    try:
        return start.replace(year=start.year + 1) - timedelta(days=1)
    except ValueError:  # 29 de febrero
        return start.replace(year=start.year + 1, day=28)


def default_dates(program: int, year: int, period: int) -> Tuple[date, date]:
    start = date(year, DEFAULT_START_MONTH[int(program)][period], 1)
    return start, one_year_after(start)


# ----------------------  PROMOTION  ----------------------

class Promotion(BaseModel):
    """Promoción (generación) de internado o de servicio social: año y periodo (1 = primera, 2 = segunda del año)."""
    __tablename__ = "promotions"
    __table_args__ = (
        UniqueConstraint("program", "year", "period", name="uq_promotion_program_year_period"),
        Index("ix_promotion_program_year_period", "program", "year", "period"),
    )

    promotion_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    program: Mapped[ProgramEnum] = mapped_column(
        IntEnumType(ProgramEnum), nullable=False, default=ProgramEnum.INTERNSHIP, server_default="1"
    )
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)
    # Fechas de la promoción; el año y el periodo se derivan de la de inicio.
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_finished: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    @property
    def label(self) -> str:
        """Etiqueta legible, p. ej. "Jul 2026 – Jun 2027"."""
        if self.start_date and self.end_date:
            s, e = self.start_date, self.end_date
            return f"{MONTH_ABBR[s.month - 1]} {s.year} – {MONTH_ABBR[e.month - 1]} {e.year}"
        return f"{self.year} - {'Primer' if self.period == 1 else 'Segundo'} periodo"

    def __repr__(self):
        return f"<Promotion(promotion_id={self.promotion_id}, program={self.program.name}, year={self.year}, period={self.period})>"


# ----------------------  PROMOTION SITE DETAIL  ----------------------

class PromotionSiteDetail(BaseModel):
    """Cupo (capacity) de una sede dentro de una promoción."""
    __tablename__ = "promotion_site_details"
    __table_args__ = (
        UniqueConstraint("promotion_id", "site_id", name="uq_psd_promotion_site"),
        Index("ix_psd_promotion_id", "promotion_id"),
        Index("ix_psd_site_id", "site_id"),
    )

    psd_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    promotion_id: Mapped[int] = mapped_column(ForeignKey("promotions.promotion_id"), nullable=False)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.site_id"), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    site: Mapped["Site"] = relationship(back_populates="promotion_details", lazy="joined")
    promotion: Mapped["Promotion"] = relationship(lazy="joined")

    def __repr__(self):
        return f"<PromotionSiteDetail(promotion_id={self.promotion_id}, site_id={self.site_id}, capacity={self.capacity})>"
