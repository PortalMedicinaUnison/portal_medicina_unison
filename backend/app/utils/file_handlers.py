from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse
from typing import Any

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


def get_file_response(
    doc: Any,
    inline: bool = True,
) -> FileResponse:
    """
    
    Args:
        document_id: ID del documento
        parent_id: ID del padre (internship_id, student_id, etc.)
        parent_id_field: Nombre del campo del padre en el modelo
        repo_class: Clase del repositorio
        db: Sesión de base de datos
        inline: True para visualizar, False para descargar
    
    Returns:
        FileResponse con el archivo
    
    Raises:
        HTTPException: Si el documento no existe o no pertenece al padre
    """

    file_path = Path(doc.path)
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Archivo no disponible")
    
    disposition = "inline" if inline else "attachment"
    
    return FileResponse(
        path=str(file_path),
        media_type=doc.media_type,
        filename=file_path.name,
        headers={"Content-Disposition": f'{disposition}; filename="{file_path.name}"'}
    )
