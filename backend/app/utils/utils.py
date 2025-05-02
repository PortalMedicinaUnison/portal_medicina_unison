from typing import List, Optional, Any

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