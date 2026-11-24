"""
Fixtures de pruebas de integración: cada prueba usa una BD SQLite en memoria nueva
y un directorio temporal para archivos. La configuración se fija aquí con variables
de entorno ANTES de importar la app, así que nunca se toca la BD de desarrollo.
"""
import os
import tempfile
from pathlib import Path

_TMP_DIR = Path(tempfile.mkdtemp(prefix="pmu_tests_"))
os.environ["SECRET_KEY"] = "test-secret-key-0123456789abcdef0123456789"
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["UPLOAD_DIR"] = str(_TMP_DIR / "uploads")
os.environ["ENVIRONMENT"] = "test"
os.environ["MAX_UPLOAD_MB"] = "1"
os.environ["MAX_PHOTO_MB"] = "1"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from core.dependencies import get_db  # noqa: E402
from core.security import create_access_token, hash_password  # noqa: E402
from db.database import enable_sqlite_pragmas  # noqa: E402
from main import app  # noqa: E402
from models import Base, User, UserEnrollment  # noqa: E402

PASSWORD = "Password1"
PDF_BYTES = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"
PNG_BYTES = b"\x89PNG\r\n\x1a\n" + b"\x00" * 64
JPEG_BYTES = b"\xff\xd8\xff\xe0" + b"\x00" * 64


@pytest.fixture()
def engine():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    enable_sqlite_pragmas(engine, wal=False)
    Base.metadata.create_all(engine)
    yield engine
    engine.dispose()


@pytest.fixture()
def session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False)


@pytest.fixture()
def db(session_factory):
    session = session_factory()
    yield session
    session.close()


@pytest.fixture()
def client(session_factory):
    def override_get_db():
        session = session_factory()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def auth(user: User) -> dict:
    return {"Authorization": f"Bearer {create_access_token(user.user_id)}"}


@pytest.fixture()
def make_user(db):
    def _make(email: str, academic_id: str = None, is_admin: bool = False, is_super_admin: bool = False,
              password: str = PASSWORD) -> User:
        if academic_id:
            db.add(UserEnrollment(academic_id=academic_id, is_enrolled=True))
            db.flush()
        user = User(
            academic_id=academic_id, first_name="Nombre", last_name="Apellido", email=email,
            password=hash_password(password), is_admin=is_admin, is_super_admin=is_super_admin,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    return _make


@pytest.fixture()
def admin(make_user):
    return make_user("admin@unison.mx", is_admin=True)


@pytest.fixture()
def super_admin(make_user):
    return make_user("super@unison.mx", is_admin=True, is_super_admin=True)


@pytest.fixture()
def student(make_user):
    return make_user("alumno@unison.mx", academic_id="222000001")


@pytest.fixture()
def other_student(make_user):
    return make_user("otro@unison.mx", academic_id="222000002")


@pytest.fixture()
def catalog(client, admin):
    """Institución, dos sedes y una promoción del año en curso con cupo 1 en la primera sede."""
    from datetime import date

    headers = auth(admin)
    institution = client.post("/institutions", json={"name": "IMSS"}, headers=headers).json()
    site_a = client.post("/sites", headers=headers, json={
        "name": "Hospital A", "institution_id": institution["institution_id"], "address": "Calle 1",
        "city": "Hermosillo", "teaching_head_name": "Dra. A",
    }).json()
    site_b = client.post("/sites", headers=headers, json={
        "name": "Hospital B", "institution_id": institution["institution_id"], "address": "Calle 2",
        "city": "Cajeme", "teaching_head_name": "Dr. B",
    }).json()
    promotion = client.post("/promotions", headers=headers, json={"year": date.today().year, "period": 1}).json()
    psd = client.post("/promotion-site-details", headers=headers, json={
        "promotion_id": promotion["promotion_id"], "site_id": site_a["site_id"], "capacity": 1,
    }).json()
    return {"institution": institution, "site_a": site_a, "site_b": site_b, "promotion": promotion, "psd": psd}
