from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


try:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(bind=engine)
