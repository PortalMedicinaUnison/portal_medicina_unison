"""
Comprobación al arrancar: avisa si la base de datos no está en la misma versión que las
migraciones del código (p. ej. el servidor siguió corriendo con --reload mientras llegaba una
migración nueva). Sin el aviso, el síntoma es un 500 "no such column" al primer uso.
"""
import logging
from typing import Optional

from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy.engine import Engine

from core.settings import BACKEND_DIR

logger = logging.getLogger("uvicorn.error")


def migration_problem(engine: Engine) -> Optional[str]:
    """Devuelve un mensaje si la BD no está en la última migración; None si está al día."""
    script = ScriptDirectory.from_config(Config(str(BACKEND_DIR / "alembic.ini")))
    expected = set(script.get_heads())
    with engine.connect() as connection:
        current = set(MigrationContext.configure(connection).get_current_heads())
    if current == expected:
        return None

    found = ", ".join(sorted(current)) or "ninguna"
    known = {revision.revision for revision in script.walk_revisions()}
    if current - known:
        return (
            f"La base de datos tiene una migración más nueva que este código (BD: {found}; código: "
            f"{', '.join(sorted(expected))}). ¿Cambiaste de rama? Vuelve a la rama más reciente o, desde esa rama, "
            "baja la BD con `alembic downgrade <revisión>`."
        )
    return (
        f"Faltan migraciones en la base de datos (BD: {found}; código: {', '.join(sorted(expected))}). "
        "Detén el servidor y vuelve a ejecutar ./dev-backend.sh, o ejecuta `cd backend && alembic upgrade head`."
    )


def warn_if_migrations_pending(engine: Engine) -> None:
    try:
        problem = migration_problem(engine)
    except Exception:  # noqa: BLE001 - la comprobación nunca debe impedir que arranque la API
        logger.exception("No se pudo comprobar la versión de la base de datos.")
        return
    if problem:
        logger.error(problem)
