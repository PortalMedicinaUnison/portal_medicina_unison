"""Catálogo de documentos por programa y etapa, con su formato descargable (lo administra la coordinación)."""
from pathlib import Path
from typing import List, Optional, Tuple

from fastapi import UploadFile
from sqlalchemy.orm import Session

from core.errors import not_found
from models.document import DocumentRequirement, DocumentStageEnum
from models.promotion import ProgramEnum
from repos.document import DocumentRequirementRepo
from schemas.document import DocumentRequirementInput, DocumentRequirementUpdate
from utils.file_handlers import delete_upload, resolve_upload, save_template_upload

TEMPLATE_DIR = "document-templates"


def list_requirements(
    db: Session, program: Optional[ProgramEnum], stage: Optional[DocumentStageEnum], include_inactive: bool = False,
) -> List[DocumentRequirement]:
    return DocumentRequirementRepo(db).list(program=program, stage=stage, include_inactive=include_inactive)


def get_requirement(db: Session, requirement_id: int) -> DocumentRequirement:
    requirement = DocumentRequirementRepo(db).get(requirement_id)
    if requirement is None:
        raise not_found("Documento del catálogo no encontrado.")
    return requirement


def create_requirement(db: Session, data: DocumentRequirementInput) -> DocumentRequirement:
    return DocumentRequirementRepo(db).add(DocumentRequirement(**data.model_dump()))


def update_requirement(db: Session, requirement_id: int, data: DocumentRequirementUpdate) -> DocumentRequirement:
    requirement = get_requirement(db, requirement_id)
    return DocumentRequirementRepo(db).update(requirement, data.model_dump(exclude_unset=True))


def retire_requirement(db: Session, requirement_id: int) -> None:
    """Lo quita del catálogo: ya no se pide, pero los archivos subidos siguen en los expedientes."""
    DocumentRequirementRepo(db).soft_delete(get_requirement(db, requirement_id))


def upload_template(db: Session, requirement_id: int, file: UploadFile) -> DocumentRequirement:
    requirement = get_requirement(db, requirement_id)
    path, original_name, media_type = save_template_upload(file, TEMPLATE_DIR)
    old_path = requirement.template_path
    updated = DocumentRequirementRepo(db).update(requirement, {
        "template_path": path, "template_media_type": media_type, "template_filename": original_name,
    })
    delete_upload(old_path)
    return updated


def delete_template(db: Session, requirement_id: int) -> DocumentRequirement:
    requirement = get_requirement(db, requirement_id)
    old_path = requirement.template_path
    updated = DocumentRequirementRepo(db).update(requirement, {
        "template_path": None, "template_media_type": None, "template_filename": None,
    })
    delete_upload(old_path)
    return updated


def get_template_file(db: Session, requirement_id: int) -> Tuple[Path, DocumentRequirement]:
    requirement = get_requirement(db, requirement_id)
    if not requirement.template_path:
        raise not_found("Este documento no tiene un formato para descargar.")
    return resolve_upload(requirement.template_path), requirement
