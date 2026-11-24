import pytest

from core.settings import BACKEND_DIR, Settings


def _settings(**overrides):
    values = {"SECRET_KEY": "x" * 40, "DATABASE_URL": "sqlite://", **overrides}
    return Settings(_env_file=None, **values)


@pytest.mark.parametrize("url,expected", [
    ("sqlite:///data/portal.db", f"sqlite:///{BACKEND_DIR / 'data' / 'portal.db'}"),
    ("sqlite:///./data/portal.db", f"sqlite:///{BACKEND_DIR / 'data' / 'portal.db'}"),
    ("sqlite:////var/lib/portal/portal.db", "sqlite:////var/lib/portal/portal.db"),
    ("sqlite://", "sqlite://"),
    ("sqlite:///:memory:", "sqlite:///:memory:"),
    ("postgresql://user:pass@db/portal", "postgresql://user:pass@db/portal"),
])
def test_relative_sqlite_paths_resolve_from_backend_dir(url, expected):
    assert _settings(DATABASE_URL=url).DATABASE_URL == expected


def test_production_requires_long_secret():
    with pytest.raises(ValueError):
        Settings(_env_file=None, SECRET_KEY="corta", DATABASE_URL="sqlite://", ENVIRONMENT="prod")
    assert _settings(ENVIRONMENT="prod").ENVIRONMENT == "prod"
