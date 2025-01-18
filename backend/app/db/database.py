from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = "sqlite:///../medical_intership.db"

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine)