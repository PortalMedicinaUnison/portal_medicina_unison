from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.settings import settings
from models.base import Base

print(f"📌 DATABASE_URL en database.py: {settings.DATABASE_URL}")

try:
    # engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
    engine = create_engine("sqlite:///../../project.db", connect_args={"check_same_thread": False})
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")


SessionLocal = sessionmaker(bind=engine)

def initialize_database():
    Base.metadata.create_all(bind=engine)
