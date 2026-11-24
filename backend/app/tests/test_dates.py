from datetime import date, datetime, timezone

import pytest

from utils import dates, validation


@pytest.fixture()
def evening_in_hermosillo(monkeypatch):
    """23 nov 2026 a las 20:00 en Hermosillo = 24 nov 2026 a las 03:00 UTC."""
    monkeypatch.setattr(dates, "now_utc", lambda: datetime(2026, 11, 24, 3, 0, tzinfo=timezone.utc))


def test_local_today_uses_portal_timezone_not_server_utc(evening_in_hermosillo):
    assert dates.local_today() == date(2026, 11, 23)


def test_today_is_valid_even_when_utc_is_already_tomorrow(evening_in_hermosillo):
    # Un estudiante que reporta "hoy" a las 20:00 no debe recibir "la fecha no puede ser posterior a hoy".
    assert validation.validate_not_future(date(2026, 11, 23)) == date(2026, 11, 23)
    with pytest.raises(ValueError):
        validation.validate_not_future(date(2026, 11, 24))
    # Y una encuesta que vence "hoy" sigue siendo válida.
    assert validation.validate_not_past(date(2026, 11, 23)) == date(2026, 11, 23)
