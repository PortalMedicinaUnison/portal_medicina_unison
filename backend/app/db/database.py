from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL (replace with your own database URL)
SQLALCHEMY_DATABASE_URL = "sqlite:///../project.db"

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# DATABASE_PATH = os.path.join(BASE_DIR, "project.db")

# SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine)