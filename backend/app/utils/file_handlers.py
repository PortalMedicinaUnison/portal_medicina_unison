"""Guardado y lectura de archivos subidos (documentos PDF, formatos, fotos de perfil y evidencias de reportes)."""
from pathlib import Path, PurePosixPath
from typing import BinaryIO, Optional, Tuple
from uuid import uuid4

from fastapi import UploadFile

from core.errors import bad_request, not_found, payload_too_large
from core.settings import settings

PDF_SIGNATURE = b"%PDF-"
CHUNK_SIZE = 1024 * 1024
IMAGE_MEDIA_TYPES = {".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}

# Formatos descargables: extensión → (firma del contenido, tipo MIME).
_ZIP_SIGNATURE = b"PK\x03\x04"           # .docx, .xlsx y .odt son archivos ZIP
_OLE_SIGNATURE = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"  # .doc y .xls (Office 97-2003)
TEMPLATE_FORMATS = {
    ".pdf": (PDF_SIGNATURE, "application/pdf"),
    ".docx": (_ZIP_SIGNATURE, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    ".xlsx": (_ZIP_SIGNATURE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    ".odt": (_ZIP_SIGNATURE, "application/vnd.oasis.opendocument.text"),
    ".doc": (_OLE_SIGNATURE, "application/msword"),
    ".xls": (_OLE_SIGNATURE, "application/vnd.ms-excel"),
}


def _clean_filename(filename: Optional[str]) -> Optional[str]:
    if not filename:
        return None
    name = PurePosixPath(filename.replace("\\", "/")).name.strip()
    return name[:255] or None


def _write_upload(source: BinaryIO, header: bytes, relative: PurePosixPath, max_bytes: int, max_mb: int) -> str:
    """Escribe el archivo por partes en UPLOAD_DIR/<relative>; lo borra si supera el tamaño."""
    target = settings.UPLOAD_DIR / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    size = len(header)
    try:
        with open(target, "wb") as out:
            out.write(header)
            while chunk := source.read(CHUNK_SIZE):
                size += len(chunk)
                if size > max_bytes:
                    raise payload_too_large(f"El archivo supera el tamaño máximo de {max_mb} MB.")
                out.write(chunk)
    except BaseException:
        target.unlink(missing_ok=True)
        raise
    return relative.as_posix()


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
    path = _write_upload(file.file, header, relative, settings.max_upload_bytes, settings.MAX_UPLOAD_MB)
    return path, _clean_filename(file.filename)


def save_template_upload(file: UploadFile, subdir: str) -> Tuple[str, Optional[str], str]:
    """
    Guarda un formato descargable (PDF, Word, Excel u OpenDocument). La extensión del nombre
    debe coincidir con el contenido. Devuelve (ruta relativa, nombre original, tipo MIME).
    """
    original_name = _clean_filename(file.filename)
    extension = PurePosixPath(original_name or "").suffix.lower()
    if extension not in TEMPLATE_FORMATS:
        raise bad_request("El formato debe ser PDF, Word (.docx, .doc), Excel (.xlsx, .xls) u OpenDocument (.odt).")
    signature, media_type = TEMPLATE_FORMATS[extension]
    header = file.file.read(len(signature))
    if header != signature:
        raise bad_request("El contenido del archivo no corresponde a su extensión.")
    relative = PurePosixPath(subdir) / f"{uuid4().hex}{extension}"
    path = _write_upload(file.file, header, relative, settings.max_upload_bytes, settings.MAX_UPLOAD_MB)
    return path, original_name, media_type


def _image_extension(header: bytes) -> Optional[str]:
    if header.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if header.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if header[:4] == b"RIFF" and header[8:12] == b"WEBP":
        return ".webp"
    return None


def save_image_upload(file: UploadFile, subdir: str) -> str:
    """Guarda una imagen JPEG, PNG o WebP (comprobada por su contenido). Devuelve la ruta relativa."""
    header = file.file.read(12)
    extension = _image_extension(header)
    if extension is None:
        raise bad_request("La foto debe ser una imagen JPEG, PNG o WebP.")
    relative = PurePosixPath(subdir) / f"{uuid4().hex}{extension}"
    return _write_upload(file.file, header, relative, settings.max_photo_bytes, settings.MAX_PHOTO_MB)


def save_evidence_upload(file: UploadFile, subdir: str) -> Tuple[str, Optional[str], str, int]:
    """
    Guarda una evidencia: PDF o imagen JPEG, PNG o WebP (comprobada por su contenido) dentro del
    tamaño máximo. Devuelve (ruta relativa, nombre original, tipo MIME, tamaño en bytes).
    """
    header = file.file.read(12)
    if header.startswith(PDF_SIGNATURE):
        extension, media_type = ".pdf", "application/pdf"
    else:
        extension = _image_extension(header)
        if extension is None:
            raise bad_request("La evidencia debe ser un PDF o una imagen JPEG, PNG o WebP.")
        media_type = IMAGE_MEDIA_TYPES[extension]
    relative = PurePosixPath(subdir) / f"{uuid4().hex}{extension}"
    path = _write_upload(file.file, header, relative, settings.max_upload_bytes, settings.MAX_UPLOAD_MB)
    return path, _clean_filename(file.filename), media_type, resolve_upload(path).stat().st_size


def image_media_type(relative_path: str) -> str:
    return IMAGE_MEDIA_TYPES.get(PurePosixPath(relative_path).suffix.lower(), "application/octet-stream")


def resolve_upload(relative_path: str) -> Path:
    """Ruta absoluta de un archivo guardado; impide salir de UPLOAD_DIR."""
    base = settings.UPLOAD_DIR.resolve()
    path = (base / relative_path).resolve()
    if not path.is_relative_to(base) or not path.is_file():
        raise not_found("El archivo no está disponible.")
    return path


def delete_upload(relative_path: Optional[str]) -> None:
    """Borra un archivo guardado si existe (sin fallar si ya no está)."""
    if not relative_path:
        return
    base = settings.UPLOAD_DIR.resolve()
    path = (base / relative_path).resolve()
    if path.is_relative_to(base):
        path.unlink(missing_ok=True)
