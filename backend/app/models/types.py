from sqlalchemy.types import TypeDecorator, Integer
from typing import Any, Optional
from enum import IntEnum

class IntEnumType(TypeDecorator):
    """
    Convierte un enumerado (basado en IntEnum) a un entero en la base de datos y viceversa.
    """
    impl = Integer

    def __init__(self, enum_class, *args, **kwargs):
        if not issubclass(enum_class, IntEnum):
            raise TypeError(f"{enum_class.__name__} debe ser una subclase de IntEnum")
        self._enum_class = enum_class
        super().__init__(*args, **kwargs)

    def process_bind_param(self, value: Optional[Any], dialect: Any) -> Optional[int]:
        if value is None:
            return None
        if isinstance(value, self._enum_class):
            return int(value)
        if isinstance(value, int):
            return value
        raise ValueError(f"Valor inválido para {self._enum_class.__name__}: {value}")

    def process_result_value(self, value: Optional[int], dialect: Any) -> Optional[IntEnum]:
        if value is None:
            return None
        return self._enum_class(value)
