"""Guardado y lectura de archivos subidos (documentos PDF del internado)."""
from pathlib import Path, PurePosixPath
from typing import Optional, Tuple
from uuid import uuid4

from fastapi import UploadFile

from core.errors import bad_request, not_found, payload_too_large
from core.settings import settings

PDF_SIGNATURE = b"%PDF-"
CHUNK_SIZE = 1024 * 1024


def _clean_filename(filename: Optional[str]) -> Optional[str]:
    if not filename:
        return None
    name = PurePosixPath(filename.replace("\\", "/")).name.strip()
    return name[:255] or None


def save_pdf_upload(file: UploadFile, subdir: str) -> Tuple[str, Optional[str]]:
    """
    Valida que el archivo sea un PDF dentro del tamaño máximo y lo guarda en
    UPLOAD_DIR/<subdir>/<uuid>.pdf. Devuelve (ruta relativa a UPLOAD_DIR, nombre original).
    El tipo se comprueba por el contenido, no por lo que declara el cliente.
    """
    header = file.file.read(len(PDF_SIGNATURE))
    if header != PDF_SIGNATURE:
        raise bad_request("El archivo debe ser un PDF.")

    relative = PurePosixPath(subdir) / f"{uuid4().hex}.pdf"
    target = settings.UPLOAD_DIR / relative
    target.parent.mkdir(parents=True, exist_ok=True)

    size = len(header)
    try:
        with open(target, "wb") as out:
            out.write(header)
            while chunk := file.file.read(CHUNK_SIZE):
                size += len(chunk)
                if size > settings.max_upload_bytes:
                    raise payload_too_large(f"El archivo supera el tamaño máximo de {settings.MAX_UPLOAD_MB} MB.")
                out.write(chunk)
    except BaseException:
        target.unlink(missing_ok=True)
        raise
    return relative.as_posix(), _clean_filename(file.filename)


def resolve_upload(relative_path: str) -> Path:
    """Ruta absoluta de un archivo guardado; impide salir de UPLOAD_DIR."""
    base = settings.UPLOAD_DIR.resolve()
    path = (base / relative_path).resolve()
    if not path.is_relative_to(base) or not path.is_file():
        raise not_found("El archivo no está disponible.")
    return path
