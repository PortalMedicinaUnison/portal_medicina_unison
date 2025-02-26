import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import Base
from models.user import User  # Importa los modelos

# Base de datos en memoria para pruebas
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Crea una sesión de prueba y una base de datos limpia para cada test."""
    print("Creando tablas de prueba")
    Base.metadata.create_all(bind=engine)  # Crea tablas
    print("Creando sesión de prueba")
    session = TestingSessionLocal()
    print("Iniciando transacción")
    yield session  # Devuelve la sesión de prueba
    print("Limpiando base de datos")
    session.rollback()
    print("Eliminando tablas de prueba")
    session.close()
