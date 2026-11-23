from typing import Generic, Optional, Type, TypeVar

from sqlalchemy.orm import Query, Session

from models.base import BaseModel

ModelT = TypeVar("ModelT", bound=BaseModel)


class BaseRepo(Generic[ModelT]):
    """Operaciones comunes. El borrado es lógico (is_active = False)."""

    model: Type[ModelT]

    def __init__(self, session: Session):
        self.session = session

    def query(self) -> Query:
        """Consulta sobre los registros activos."""
        return self.session.query(self.model).filter(self.model.is_active.is_(True))

    def get(self, obj_id: int) -> Optional[ModelT]:
        obj = self.session.get(self.model, obj_id)
        return obj if obj is not None and obj.is_active else None

    def add(self, obj: ModelT) -> ModelT:
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def update(self, obj: ModelT, data: dict) -> ModelT:
        for key, value in data.items():
            setattr(obj, key, value)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def soft_delete(self, obj: ModelT) -> None:
        obj.is_active = False
        self.session.commit()
