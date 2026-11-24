"""document catalog and expediente

Catálogo de documentos por programa y etapa (editable por la coordinación) y expediente por
asignación con revisión. Carga el catálogo inicial de Hermosillo, pasa los documentos que ya
existían (internship_documents y social_service_documents) al expediente y borra esas tablas.

Fuentes del catálogo inicial (docs/ de la coordinación):
- Internado: Manual y Programa Académico del Internado de Pregrado (2022), inscripción p. 12.
- Servicio social: convocatoria de agosto de 2026 (base 6) y, como opcionales, los documentos
  extra del artículo 21 de los Lineamientos del Servicio Social; liberación: artículo 60.

Revision ID: 0004
Revises: 0003
Create Date: 2026-11-23 20:38:15.063536

"""
from datetime import datetime, timezone
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0004'
down_revision: Union[str, Sequence[str], None] = '0003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

INTERNSHIP, SOCIAL_SERVICE = 1, 2
INSCRIPTION, IN_PROGRESS, COMPLETION = 1, 2, 3

# (requirement_id, program, stage, sort_order, name, is_required, allows_multiple, validity_months, description)
CATALOG = [
    # ---------------- Internado de pregrado ----------------
    (1, INTERNSHIP, INSCRIPTION, 10, "Solicitud de inscripción al internado de pregrado", True, False, None,
     "Llena y firmada. Descarga el formato vigente."),
    (2, INTERNSHIP, INSCRIPTION, 20, "Kárdex", False, False, None,
     "Que muestre todas las materias acreditadas y al menos 494 créditos."),
    (3, INTERNSHIP, INSCRIPTION, 30, "Certificado de salud", True, False, None,
     "Reciente, expedido por una institución de salud oficial."),
    (4, INTERNSHIP, INSCRIPTION, 40, "Certificado de salud mental", True, False, None,
     "Expedido por el área de Psicología de la Universidad de Sonora."),
    (5, INTERNSHIP, INSCRIPTION, 50, "Póliza de seguridad social o seguro médico", True, False, None,
     "IMSS, ISSSTE, ISSSTESON o un seguro médico privado vigente."),
    (6, INTERNSHIP, IN_PROGRESS, 10, "Bitácora de actividades", True, True, None,
     "Sube la bitácora de cada servicio o rotación, firmada por tu tutor y el jefe de enseñanza."),
    (7, INTERNSHIP, COMPLETION, 10, "Constancia de culminación del internado", True, False, None,
     "Emitida por la institución de salud donde realizaste el internado."),
    (8, INTERNSHIP, COMPLETION, 20, "Calificaciones por rotación", False, False, None,
     "Calificación final y parciales de cada rotación, emitidas por la unidad hospitalaria."),
    # ---------------- Servicio social de medicina ----------------
    (9, SOCIAL_SERVICE, INSCRIPTION, 10, "Ficha de inscripción al servicio social", True, False, None,
     "Llena y firmada, con tu promedio general hasta el internado (dos decimales)."),
    (10, SOCIAL_SERVICE, INSCRIPTION, 20, "Kárdex o constancia de calificaciones", True, False, None,
     "Con el total de créditos de la licenciatura."),
    (11, SOCIAL_SERVICE, INSCRIPTION, 30, "Certificado médico", True, False, 3,
     "Expedido por una institución de salud pública (IMSS, Servicios de Salud de Sonora, ISSSTE o ISSSTESON). "
     "Debe indicar si tienes alguna enfermedad crónico-degenerativa o de importancia clínica."),
    (12, SOCIAL_SERVICE, INSCRIPTION, 40, "CURP", True, False, None, None),
    (13, SOCIAL_SERVICE, INSCRIPTION, 50, "Carta de responsabilidad", True, False, None,
     "Firmada. Declaras que conoces los lineamientos y reglamentos del servicio social."),
    (14, SOCIAL_SERVICE, INSCRIPTION, 60, "Carta compromiso", True, False, None,
     "Firmada, con tu respuesta (acepto / no acepto)."),
    (15, SOCIAL_SERVICE, INSCRIPTION, 70, "Dictamen del área de Psicología de la Universidad de Sonora", False, False, None,
     "Que indique que estás en condiciones de realizar tu servicio social (Lineamientos, art. 21)."),
    (16, SOCIAL_SERVICE, INSCRIPTION, 80, "Constancia de culminación del internado de pregrado", False, False, None,
     "Emitida por la Secretaría de Salud del Estado de Sonora o la institución de salud donde lo realizaste (Lineamientos, art. 21)."),
    (17, SOCIAL_SERVICE, INSCRIPTION, 90, "Calificaciones del internado por rotación", False, False, None,
     "Calificación final y parciales emitidas por la unidad hospitalaria (Lineamientos, art. 21)."),
    (18, SOCIAL_SERVICE, IN_PROGRESS, 10, "Nombramiento", False, False, None,
     "Nombramiento o carta de asignación que expide el Departamento de Medicina y Ciencias de la Salud."),
    (19, SOCIAL_SERVICE, COMPLETION, 10, "Proyecto final", True, False, None,
     "Aprobado. Según tu modalidad: diagnóstico de salud comunitario, reporte de caso clínico, "
     "artículo de investigación enviado o reporte técnico-médico."),
    (20, SOCIAL_SERVICE, COMPLETION, 20, "Constancias de cursos a distancia", True, True, None,
     "Mínimo 80 horas en materia de salud y/o investigación."),
    (21, SOCIAL_SERVICE, COMPLETION, 30, "Carta de liberación", True, False, None,
     "Emitida por la institución de salud y dirigida a la Universidad de Sonora."),
    (22, SOCIAL_SERVICE, COMPLETION, 40, "Reportes trimestrales", True, True, None,
     "Por ahora sube el acuse de cada reporte trimestral que registres en la plataforma de servicio social "
     "de la Universidad de Sonora."),
    (23, SOCIAL_SERVICE, COMPLETION, 50, "Reporte final", True, False, None,
     "Con los criterios del Reglamento de Servicio Social Universitario de la Universidad de Sonora."),
]

# Tipos fijos anteriores → requisito del catálogo (para pasar los documentos existentes).
INTERNSHIP_TYPE_TO_REQUIREMENT = {1: 6, 2: 7, 3: 2, 4: 3}      # bitácora, carta de finalización, kárdex, certificado
SOCIAL_SERVICE_TYPE_TO_REQUIREMENT = {1: 18, 2: 22, 3: 22, 4: 22, 5: 23, 6: 21}  # asignación, 3 informes, final, constancia


def _case(column: str, mapping: dict) -> str:
    whens = " ".join(f"WHEN {old} THEN {new}" for old, new in mapping.items())
    return f"CASE {column} {whens} END"


def _seed_catalog() -> None:
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    table = sa.table(
        'document_requirements',
        sa.column('requirement_id', sa.Integer), sa.column('program', sa.Integer), sa.column('stage', sa.Integer),
        sa.column('sort_order', sa.Integer), sa.column('name', sa.String), sa.column('is_required', sa.Boolean),
        sa.column('allows_multiple', sa.Boolean), sa.column('validity_months', sa.Integer),
        sa.column('description', sa.Text), sa.column('is_active', sa.Boolean),
        sa.column('created_at', sa.DateTime), sa.column('updated_at', sa.DateTime),
    )
    op.bulk_insert(table, [
        {
            'requirement_id': rid, 'program': program, 'stage': stage, 'sort_order': order, 'name': name,
            'is_required': required, 'allows_multiple': multiple, 'validity_months': validity,
            'description': description, 'is_active': True, 'created_at': now, 'updated_at': now,
        }
        for rid, program, stage, order, name, required, multiple, validity, description in CATALOG
    ])
    if op.get_bind().dialect.name == 'postgresql':
        op.execute("SELECT setval('document_requirements_requirement_id_seq', (SELECT MAX(requirement_id) FROM document_requirements))")


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('document_requirements',
    sa.Column('requirement_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('program', sa.Integer(), nullable=False),
    sa.Column('stage', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=150), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_required', sa.Boolean(), nullable=False),
    sa.Column('allows_multiple', sa.Boolean(), nullable=False),
    sa.Column('validity_months', sa.Integer(), nullable=True),
    sa.Column('sort_order', sa.Integer(), nullable=False),
    sa.Column('template_path', sa.String(length=1024), nullable=True),
    sa.Column('template_media_type', sa.String(length=100), nullable=True),
    sa.Column('template_filename', sa.String(length=255), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('requirement_id')
    )
    with op.batch_alter_table('document_requirements', schema=None) as batch_op:
        batch_op.create_index('idx_requirement_program_stage', ['program', 'stage'], unique=False)

    op.create_table('application_documents',
    sa.Column('document_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('requirement_id', sa.Integer(), nullable=False),
    sa.Column('internship_application_id', sa.Integer(), nullable=True),
    sa.Column('social_service_application_id', sa.Integer(), nullable=True),
    sa.Column('path', sa.String(length=1024), nullable=False),
    sa.Column('media_type', sa.String(length=100), nullable=False),
    sa.Column('original_filename', sa.String(length=255), nullable=True),
    sa.Column('review_status', sa.Integer(), nullable=False),
    sa.Column('review_comment', sa.Text(), nullable=True),
    sa.Column('reviewed_at', sa.DateTime(), nullable=True),
    sa.Column('reviewed_by_id', sa.Integer(), nullable=True),
    sa.Column('uploaded_by_id', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.CheckConstraint('(internship_application_id IS NULL) <> (social_service_application_id IS NULL)', name='ck_application_document_single_application'),
    sa.ForeignKeyConstraint(['internship_application_id'], ['internship_applications.application_id'], name='fk_app_doc_internship_application'),
    sa.ForeignKeyConstraint(['requirement_id'], ['document_requirements.requirement_id'], name='fk_app_doc_requirement'),
    sa.ForeignKeyConstraint(['reviewed_by_id'], ['users.user_id'], name='fk_app_doc_reviewed_by'),
    sa.ForeignKeyConstraint(['social_service_application_id'], ['social_service_applications.application_id'], name='fk_app_doc_social_service_application'),
    sa.ForeignKeyConstraint(['uploaded_by_id'], ['users.user_id'], name='fk_app_doc_uploaded_by'),
    sa.PrimaryKeyConstraint('document_id')
    )
    with op.batch_alter_table('application_documents', schema=None) as batch_op:
        batch_op.create_index('idx_app_doc_internship_application', ['internship_application_id'], unique=False)
        batch_op.create_index('idx_app_doc_requirement', ['requirement_id'], unique=False)
        batch_op.create_index('idx_app_doc_social_service_application', ['social_service_application_id'], unique=False)

    _seed_catalog()

    # Documentos existentes → expediente de su asignación (quedan "en revisión").
    op.execute(f"""
        INSERT INTO application_documents (requirement_id, internship_application_id, path, media_type,
            original_filename, review_status, is_active, created_at, updated_at)
        SELECT {_case('d.document_type', INTERNSHIP_TYPE_TO_REQUIREMENT)}, i.application_id, d.path, d.media_type,
            d.original_filename, 1, d.is_active, d.created_at, d.updated_at
        FROM internship_documents d JOIN internships i ON i.internship_id = d.internship_id
    """)
    op.execute(f"""
        INSERT INTO application_documents (requirement_id, social_service_application_id, path, media_type,
            original_filename, review_status, is_active, created_at, updated_at)
        SELECT {_case('d.document_type', SOCIAL_SERVICE_TYPE_TO_REQUIREMENT)}, s.application_id, d.path, d.media_type,
            d.original_filename, 1, d.is_active, d.created_at, d.updated_at
        FROM social_service_documents d JOIN social_services s ON s.social_service_id = d.social_service_id
    """)

    with op.batch_alter_table('social_service_documents', schema=None) as batch_op:
        batch_op.drop_index('uq_active_ss_doc_per_type', sqlite_where=sa.text('is_active = 1'), postgresql_where=sa.text('is_active'))

    op.drop_table('social_service_documents')
    with op.batch_alter_table('internship_documents', schema=None) as batch_op:
        batch_op.drop_index('uq_active_doc_per_type', sqlite_where=sa.text('is_active = 1'), postgresql_where=sa.text('is_active'))

    op.drop_table('internship_documents')


def downgrade() -> None:
    """
    Downgrade schema. Lo posible se regresa a las tablas con tipos fijos: el archivo activo más
    reciente de cada requisito que tenía equivalente (los reportes trimestrales pasan como "primer
    informe"). Los demás archivos siguen en disco pero sin registro.
    """
    op.create_table('internship_documents',
    sa.Column('document_id', sa.INTEGER(), nullable=False),
    sa.Column('internship_id', sa.INTEGER(), nullable=False),
    sa.Column('document_type', sa.INTEGER(), nullable=False),
    sa.Column('path', sa.VARCHAR(length=1024), nullable=False),
    sa.Column('media_type', sa.VARCHAR(length=100), nullable=False),
    sa.Column('original_filename', sa.VARCHAR(length=255), nullable=True),
    sa.Column('is_active', sa.BOOLEAN(), nullable=False),
    sa.Column('created_at', sa.DATETIME(), nullable=False),
    sa.Column('updated_at', sa.DATETIME(), nullable=False),
    sa.ForeignKeyConstraint(['internship_id'], ['internships.internship_id'], ),
    sa.PrimaryKeyConstraint('document_id')
    )
    with op.batch_alter_table('internship_documents', schema=None) as batch_op:
        batch_op.create_index('uq_active_doc_per_type', ['internship_id', 'document_type'], unique=True, sqlite_where=sa.text('is_active = 1'), postgresql_where=sa.text('is_active'))

    op.create_table('social_service_documents',
    sa.Column('document_id', sa.INTEGER(), nullable=False),
    sa.Column('social_service_id', sa.INTEGER(), nullable=False),
    sa.Column('document_type', sa.INTEGER(), nullable=False),
    sa.Column('path', sa.VARCHAR(length=1024), nullable=False),
    sa.Column('media_type', sa.VARCHAR(length=100), nullable=False),
    sa.Column('original_filename', sa.VARCHAR(length=255), nullable=True),
    sa.Column('is_active', sa.BOOLEAN(), nullable=False),
    sa.Column('created_at', sa.DATETIME(), nullable=False),
    sa.Column('updated_at', sa.DATETIME(), nullable=False),
    sa.ForeignKeyConstraint(['social_service_id'], ['social_services.social_service_id'], ),
    sa.PrimaryKeyConstraint('document_id')
    )
    with op.batch_alter_table('social_service_documents', schema=None) as batch_op:
        batch_op.create_index('uq_active_ss_doc_per_type', ['social_service_id', 'document_type'], unique=True, sqlite_where=sa.text('is_active = 1'), postgresql_where=sa.text('is_active'))

    internship_back = {new: old for old, new in INTERNSHIP_TYPE_TO_REQUIREMENT.items()}
    ss_back = {18: 1, 22: 2, 23: 5, 21: 6}
    latest = "SELECT MAX(document_id) FROM application_documents WHERE is_active = {true} GROUP BY {column}, requirement_id"
    true = "TRUE" if op.get_bind().dialect.name == 'postgresql' else "1"
    op.execute(f"""
        INSERT INTO internship_documents (internship_id, document_type, path, media_type, original_filename,
            is_active, created_at, updated_at)
        SELECT i.internship_id, {_case('a.requirement_id', internship_back)}, a.path, a.media_type, a.original_filename,
            a.is_active, a.created_at, a.updated_at
        FROM application_documents a JOIN internships i ON i.application_id = a.internship_application_id
        WHERE a.requirement_id IN ({', '.join(map(str, internship_back))})
          AND a.document_id IN ({latest.format(true=true, column='internship_application_id')})
    """)
    op.execute(f"""
        INSERT INTO social_service_documents (social_service_id, document_type, path, media_type, original_filename,
            is_active, created_at, updated_at)
        SELECT s.social_service_id, {_case('a.requirement_id', ss_back)}, a.path, a.media_type, a.original_filename,
            a.is_active, a.created_at, a.updated_at
        FROM application_documents a JOIN social_services s ON s.application_id = a.social_service_application_id
        WHERE a.requirement_id IN ({', '.join(map(str, ss_back))})
          AND a.document_id IN ({latest.format(true=true, column='social_service_application_id')})
    """)

    with op.batch_alter_table('application_documents', schema=None) as batch_op:
        batch_op.drop_index('idx_app_doc_social_service_application')
        batch_op.drop_index('idx_app_doc_requirement')
        batch_op.drop_index('idx_app_doc_internship_application')

    op.drop_table('application_documents')
    with op.batch_alter_table('document_requirements', schema=None) as batch_op:
        batch_op.drop_index('idx_requirement_program_stage')

    op.drop_table('document_requirements')
