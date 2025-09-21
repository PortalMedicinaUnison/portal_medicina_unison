from pydantic import BaseModel
from sqlalchemy.inspection import inspect as sa_inspect
from typing import List, Optional, Any, Type, Mapping


def orm_to_dict(orm_model: Any, exclude: Optional[List[str]] = None, include: Optional[List[str]] = None) -> dict:
    """
    Convert an ORM model to a dictionary
    :param orm_model: The ORM model to convert
    :param exclude: List of columns to exclude
    :param include: List of columns to include
    :return: The dictionary representation of the ORM model
    """
    
    exclude = set(exclude or [])
    columns = [column.name for column in orm_model.__table__.columns]
    if include is not None:
        columns = [c for c in columns if c in include]
    data = {}
    for column in columns:
        if column not in exclude:
            data[column] = getattr(orm_model, column)
    return data

def map_to_model(input_data: BaseModel | dict, model_cls: Type[Any]) -> Any:
    """
    Crea una instancia de model_cls con los campos tal cual vienen en input_data,
    filtrando únicamente a columnas válidas del modelo.
    """
    try:
        payload = (
            input_data.model_dump(exclude_unset=True)
            if isinstance(input_data, Mapping)
            else dict(input_data)
        )
        columns = {c.key for c in sa_inspect(model_cls).columns}
        data = {k: v for k, v in payload.items() if k in columns}
        return model_cls(**data)
    except Exception as e: 
        raise ValueError(f"Error mapping to model: {e}")
    
    