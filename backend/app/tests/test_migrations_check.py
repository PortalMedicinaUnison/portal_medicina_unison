from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool

from core.settings import BACKEND_DIR
from db.migrations import migration_problem, warn_if_migrations_pending

HEAD = ScriptDirectory.from_config(Config(str(BACKEND_DIR / "alembic.ini"))).get_current_head()


def _engine_at(revision=None):
    engine = create_engine("sqlite://", poolclass=StaticPool)
    if revision:
        with engine.begin() as connection:
            connection.execute(text("CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL)"))
            connection.execute(text("INSERT INTO alembic_version VALUES (:rev)"), {"rev": revision})
    return engine


def test_database_at_head_has_no_problem():
    assert migration_problem(_engine_at(HEAD)) is None


def test_missing_migrations_explain_how_to_fix():
    message = migration_problem(_engine_at("0001"))
    assert "Faltan migraciones" in message and "alembic upgrade head" in message and HEAD in message
    assert "BD: ninguna" in migration_problem(_engine_at(None))


def test_newer_database_suggests_changing_branch():
    assert "más nueva que este código" in migration_problem(_engine_at("9999_desconocida"))


def test_warning_is_logged_not_raised(caplog):
    warn_if_migrations_pending(_engine_at("0001"))
    assert "Faltan migraciones" in caplog.text
