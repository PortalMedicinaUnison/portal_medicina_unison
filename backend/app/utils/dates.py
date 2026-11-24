from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

from core.settings import settings


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def local_today() -> date:
    """
    Fecha de hoy en la zona horaria del portal (TIMEZONE, por defecto America/Hermosillo),
    no la del servidor: un contenedor en UTC ya va un día adelante a partir de las 17:00 en Sonora.
    """
    return now_utc().astimezone(ZoneInfo(settings.TIMEZONE)).date()
