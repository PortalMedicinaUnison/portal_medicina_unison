"""
Comandos de administración. Ejecutar desde backend/app con el entorno virtual activo:

    python cli.py create-admin --email coordinacion@unison.mx --first-name Ana --last-name López [--super]
    python cli.py seed-demo        # datos de ejemplo (solo desarrollo)

La contraseña se pide por consola (no queda en el historial). Para automatizar se puede
usar la variable de entorno ADMIN_PASSWORD.
"""
import argparse
import getpass
import os
import sys

from core.security import hash_password
from core.settings import settings
from db.database import SessionLocal
from models.base import utcnow
from models.promotion import default_dates
from models import (
    ApplicationStatusEnum, Institution, Internship, InternshipApplication, InternshipStatusEnum,
    ProgramEnum, Promotion, PromotionSiteDetail, Site, SocialServiceApplication, User, UserEnrollment,
)
from utils.dates import local_today
from utils.validation import validate_email, validate_password


def _ask_password() -> str:
    password = os.environ.get("ADMIN_PASSWORD")
    if password:
        return password
    password = getpass.getpass("Contraseña: ")
    if password != getpass.getpass("Confirma la contraseña: "):
        sys.exit("Las contraseñas no coinciden.")
    return password


def create_admin(args: argparse.Namespace) -> None:
    try:
        email = validate_email(args.email)
        password = validate_password(_ask_password())
    except ValueError as exc:
        sys.exit(str(exc))

    with SessionLocal() as db:
        if db.query(User).filter(User.email == email).first():
            sys.exit(f"Ya existe un usuario con el correo {email}.")
        db.add(User(
            first_name=args.first_name.strip(),
            last_name=args.last_name.strip(),
            email=email,
            password=hash_password(password),
            is_admin=True,
            is_super_admin=args.super,
        ))
        db.commit()
    role = "Super administrador" if args.super else "Administrador"
    print(f"{role} creado: {email}")


def seed_demo(_args: argparse.Namespace) -> None:
    """Crea datos de ejemplo idempotentes para desarrollo."""
    if settings.ENVIRONMENT == "prod":
        sys.exit("seed-demo no se puede usar en producción.")

    with SessionLocal() as db:
        def get_or_create(model, defaults=None, **filters):
            obj = db.query(model).filter_by(**filters).first()
            if obj is None:
                obj = model(**filters, **(defaults or {}))
                db.add(obj)
                db.flush()
            return obj

        imss = get_or_create(Institution, name="IMSS")
        isssteson = get_or_create(Institution, name="ISSSTESON")
        sites = [
            get_or_create(Site, name="Hospital General de Zona No. 2", defaults=dict(
                institution_id=imss.institution_id, address="Blvd. Luis Encinas s/n", city="Hermosillo",
                teaching_head_name="Dra. María Pérez", for_social_service=False)),
            get_or_create(Site, name="Hospital General del Estado", defaults=dict(
                institution_id=isssteson.institution_id, address="Blvd. Luis Encinas y Reforma", city="Hermosillo",
                teaching_head_name="Dr. Jorge Ruiz", teaching_deputy_name="Dra. Laura Gómez", for_social_service=False)),
            get_or_create(Site, name="Hospital General Regional No. 1", defaults=dict(
                institution_id=imss.institution_id, address="Calle 200 y Guerrero", city="Cajeme",
                teaching_head_name="Dr. Luis Torres", for_social_service=False)),
        ]
        def get_or_create_promotion(program, year, period, is_finished=False):
            start, end = default_dates(program, year, period)
            return get_or_create(Promotion, program=program, year=year, period=period,
                                 defaults=dict(is_finished=is_finished, start_date=start, end_date=end))

        year = local_today().year
        promotion = get_or_create_promotion(ProgramEnum.INTERNSHIP, year, 1)
        for site, capacity in zip(sites, (3, 2, 2)):
            get_or_create(PromotionSiteDetail, promotion_id=promotion.promotion_id, site_id=site.site_id,
                          defaults=dict(capacity=capacity))

        for number in range(1, 6):
            get_or_create(UserEnrollment, academic_id=f"22200000{number}")

        accepted = dict(privacy_notice_version=settings.PRIVACY_NOTICE_VERSION, privacy_accepted_at=utcnow())
        get_or_create(User, email="admin@demo.unison.mx", defaults=dict(
            first_name="Coordinación", last_name="Demo", password=hash_password("Admin1234"),
            is_admin=True, is_super_admin=True, **accepted))
        enrollment = db.query(UserEnrollment).filter_by(academic_id="222000001").first()
        enrollment.is_enrolled = True
        get_or_create(User, email="alumno@demo.unison.mx", defaults=dict(
            academic_id="222000001", first_name="Alumno", last_name="Demo",
            password=hash_password("Alumno1234"), **accepted))
        db.flush()
        get_or_create(InternshipApplication, promotion_id=promotion.promotion_id, academic_id="222000001",
                      defaults=dict(status=ApplicationStatusEnum.PENDING))

        # Servicio social: plazas en centros de salud y un egresado con el internado ya acreditado.
        health = get_or_create(Institution, name="Servicios de Salud de Sonora")
        clinics = [
            get_or_create(Site, name="Centro de Salud Rural Ures", defaults=dict(
                institution_id=health.institution_id, address="Calle Juárez s/n", city="Ures",
                teaching_head_name="Dra. Rosa Valenzuela", for_internship=False)),
            get_or_create(Site, name="Centro de Salud Urbano Navojoa", defaults=dict(
                institution_id=health.institution_id, address="Av. Pesqueira 401", city="Navojoa",
                teaching_head_name="Dr. Martín Félix", for_internship=False)),
        ]
        ss_promotion = get_or_create_promotion(ProgramEnum.SOCIAL_SERVICE, year, 1)
        for clinic in clinics:
            get_or_create(PromotionSiteDetail, promotion_id=ss_promotion.promotion_id, site_id=clinic.site_id,
                          defaults=dict(capacity=2))

        past = get_or_create_promotion(ProgramEnum.INTERNSHIP, year - 1, 1, is_finished=True)
        db.query(UserEnrollment).filter_by(academic_id="222000002").first().is_enrolled = True
        get_or_create(User, email="egresado@demo.unison.mx", defaults=dict(
            academic_id="222000002", first_name="Egresado", last_name="Demo",
            password=hash_password("Alumno1234"), **accepted))
        db.flush()
        past_application = get_or_create(InternshipApplication, promotion_id=past.promotion_id, academic_id="222000002",
                                         defaults=dict(status=ApplicationStatusEnum.ACCEPTED))
        get_or_create(Internship, application_id=past_application.application_id,
                      defaults=dict(site_id=sites[0].site_id, status=InternshipStatusEnum.FINISHED))
        get_or_create(SocialServiceApplication, promotion_id=ss_promotion.promotion_id, academic_id="222000002",
                      defaults=dict(status=ApplicationStatusEnum.PENDING))
        db.commit()

    print("Datos de ejemplo listos.")
    print("  Administrador: admin@demo.unison.mx / Admin1234")
    print("  Estudiante:    alumno@demo.unison.mx / Alumno1234 (asignación de internado pendiente)")
    print("  Egresado:      egresado@demo.unison.mx / Alumno1234 (internado acreditado, servicio social pendiente)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Administración del Portal Internado de Medicina Unison")
    commands = parser.add_subparsers(dest="command", required=True)

    admin = commands.add_parser("create-admin", help="Crea una cuenta de administrador")
    admin.add_argument("--email", required=True)
    admin.add_argument("--first-name", required=True)
    admin.add_argument("--last-name", required=True)
    admin.add_argument("--super", action="store_true", help="Super administrador (puede gestionar roles)")
    admin.set_defaults(func=create_admin)

    seed = commands.add_parser("seed-demo", help="Carga datos de ejemplo (solo desarrollo)")
    seed.set_defaults(func=seed_demo)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
