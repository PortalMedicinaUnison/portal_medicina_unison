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
    

from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile


async def save_uploaded_file(file: UploadFile, upload_dir: Path, filename: str = None) -> Path:
    """
    Guarda un archivo subido en el directorio especificado usando chunks.
    
    Args:
        file: Archivo subido desde FastAPI
        upload_dir: Directorio donde se guardará el archivo
        filename: Nombre del archivo (opcional, genera uno aleatorio si no se provee)
        chunk_size: Tamaño del chunk en bytes (default: 1MB)
    
    Returns:
        Path: Ruta completa del archivo guardado
    
    Raises:
        Exception: Si hay un error al guardar el archivo
    """
    chunk_size: int = 1024 * 1024
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    if filename is None:
        extension = Path(file.filename).suffix if file.filename else ""
        filename = f"{uuid4().hex}{extension}"
    
    file_path = upload_dir / filename
    
    try:
        with open(file_path, "wb") as f:
            while chunk := await file.read(chunk_size):
                f.write(chunk)
    except Exception as e:
        file_path.unlink(missing_ok=True)
        raise Exception(f"Error saving file: {str(e)}") from e
    finally:
        await file.close()
    
    return file_path