"""project description

La descripción de "Proyecto final" (servicio social, liberación) empezaba con "Aprobado.", que se
confundía con el estatus del documento. Se reescribe solo si conserva el texto inicial de la 0004
(si la coordinación ya la editó en el catálogo, se respeta).

Revision ID: 0010
Revises: 0009
Create Date: 2026-11-24 12:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0010'
down_revision: Union[str, Sequence[str], None] = '0009'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

OLD = (
    "Aprobado. Según tu modalidad: diagnóstico de salud comunitario, reporte de caso clínico, "
    "artículo de investigación enviado o reporte técnico-médico."
)
NEW = (
    "Versión aprobada de tu proyecto final, según tu modalidad: diagnóstico de salud comunitario, "
    "reporte de caso clínico, artículo de investigación enviado o reporte técnico-médico."
)
REQUIREMENTS = sa.table("document_requirements", sa.column("requirement_id", sa.Integer), sa.column("description", sa.Text))


def _replace(current: str, replacement: str) -> None:
    op.get_bind().execute(
        REQUIREMENTS.update()
        .where(REQUIREMENTS.c.requirement_id == 19, REQUIREMENTS.c.description == current)
        .values(description=replacement)
    )


def upgrade() -> None:
    """Upgrade schema."""
    _replace(OLD, NEW)


def downgrade() -> None:
    """Downgrade schema."""
    _replace(NEW, OLD)
