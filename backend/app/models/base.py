from datetime import datetime
from sqlalchemy import DateTime, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, declarative_base

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)