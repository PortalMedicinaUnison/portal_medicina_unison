"""
Entorno de migraciones. Usa la misma configuración que la app (core.settings):
DATABASE_URL se lee de la variable de entorno o del archivo de entorno del backend.

Uso (desde backend/):
    alembic upgrade head                                  # aplica migraciones
    alembic revision --autogenerate -m "descripción"      # genera una nueva a partir de los modelos
"""
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import create_engine, pool
from sqlalchemy.engine import make_url

from core.settings import settings
import models  # noqa: F401  (registra todos los modelos en Base.metadata)
from models import Base
from models.types import IntEnumType

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
DATABASE_URL = settings.DATABASE_URL


def render_item(type_, obj, _autogen_context):
    """Los enums se guardan como enteros: las migraciones no deben depender de los modelos."""
    if type_ == "type" and isinstance(obj, IntEnumType):
        return "sa.Integer()"
    return False


def _ensure_sqlite_dir(url: str) -> None:
    parsed = make_url(url)
    if parsed.get_backend_name() == "sqlite" and parsed.database not in (None, "", ":memory:"):
        Path(parsed.database).parent.mkdir(parents=True, exist_ok=True)


def run_migrations_offline() -> None:
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True,
        compare_type=True,
        render_item=render_item,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    _ensure_sqlite_dir(DATABASE_URL)
    engine = create_engine(DATABASE_URL, poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,  # necesario para ALTER TABLE en SQLite
            compare_type=True,
            render_item=render_item,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
