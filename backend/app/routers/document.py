from typing import List, Optional

from fastapi import APIRouter, File, Form, UploadFile, status
from fastapi.responses import FileResponse

from controllers import application_document as expediente
from controllers import document_requirement as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from models.document import DocumentStageEnum
from models.promotion import ProgramEnum
from schemas.document import (
    ApplicationDocumentOutput, DocumentRequirementInput, DocumentRequirementOutput,
    DocumentRequirementUpdate, DocumentReviewInput,
)

# ----------------------  CATÁLOGO  ----------------------

document_requirement_router = APIRouter(prefix="/document-requirements", tags=["Documentos requeridos"])


@document_requirement_router.get("", response_model=List[DocumentRequirementOutput])
def list_requirements(
    user: CurrentUser, db: DbSession,
    program: Optional[ProgramEnum] = None, stage: Optional[DocumentStageEnum] = None,
    include_inactive: bool = False,
):
    """Documentos que se piden por programa y etapa. `include_inactive` (solo coordinación) agrega los retirados."""
    return controller.list_requirements(db, program, stage, include_inactive=include_inactive and user.is_staff)


@document_requirement_router.post("", response_model=DocumentRequirementOutput, status_code=status.HTTP_201_CREATED)
def create_requirement(data: DocumentRequirementInput, _admin: AdminUser, db: DbSession):
    return controller.create_requirement(db, data)


@document_requirement_router.get("/{requirement_id}", response_model=DocumentRequirementOutput)
def get_requirement(requirement_id: int, _user: CurrentUser, db: DbSession):
    return controller.get_requirement(db, requirement_id)


@document_requirement_router.patch("/{requirement_id}", response_model=DocumentRequirementOutput)
def update_requirement(requirement_id: int, data: DocumentRequirementUpdate, _admin: AdminUser, db: DbSession):
    return controller.update_requirement(db, requirement_id, data)


@document_requirement_router.delete("/{requirement_id}", status_code=status.HTTP_204_NO_CONTENT)
def retire_requirement(requirement_id: int, _admin: AdminUser, db: DbSession):
    """Lo retira del catálogo; los archivos ya subidos se conservan en los expedientes."""
    controller.retire_requirement(db, requirement_id)


@document_requirement_router.put("/{requirement_id}/template", response_model=DocumentRequirementOutput)
def upload_template(requirement_id: int, _admin: AdminUser, db: DbSession, file: UploadFile = File(...)):
    """Formato descargable: PDF, Word, Excel u OpenDocument (máximo MAX_UPLOAD_MB). Reemplaza al anterior."""
    return controller.upload_template(db, requirement_id, file)


@document_requirement_router.delete("/{requirement_id}/template", response_model=DocumentRequirementOutput)
def delete_template(requirement_id: int, _admin: AdminUser, db: DbSession):
    return controller.delete_template(db, requirement_id)


@document_requirement_router.get("/{requirement_id}/template", response_class=FileResponse)
def download_template(requirement_id: int, _user: CurrentUser, db: DbSession):
    path, requirement = controller.get_template_file(db, requirement_id)
    return FileResponse(
        path,
        media_type=requirement.template_media_type or "application/octet-stream",
        filename=requirement.template_filename or f"formato-{requirement.requirement_id}{path.suffix}",
    )


# ----------------------  EXPEDIENTE (rutas anidadas en cada asignación)  ----------------------

def add_expediente_routes(router: APIRouter, program: ProgramEnum) -> None:
    """Registra las rutas del expediente en el router de asignaciones del programa."""
    tags = ["Expediente"]

    @router.get("/{application_id}/documents", response_model=List[ApplicationDocumentOutput], tags=tags)
    def list_application_documents(application_id: int, user: CurrentUser, db: DbSession):
        """Documentos del expediente con su estado de revisión (el estudiante solo ve el suyo)."""
        return expediente.list_documents(db, user, program, application_id)

    @router.post(
        "/{application_id}/documents", response_model=ApplicationDocumentOutput,
        status_code=status.HTTP_201_CREATED, tags=tags,
    )
    def upload_application_document(
        application_id: int, user: CurrentUser, db: DbSession,
        requirement_id: int = Form(...), file: UploadFile = File(...),
    ):
        """Sube un PDF para un documento del catálogo; queda en revisión."""
        return expediente.upload_document(db, user, program, application_id, requirement_id, file)

    @router.get("/{application_id}/documents/{document_id}/file", response_class=FileResponse, tags=tags)
    def get_application_document_file(
        application_id: int, document_id: int, user: CurrentUser, db: DbSession, download: bool = False,
    ):
        """Devuelve el PDF. `download=true` lo descarga; si no, se muestra en el navegador."""
        path, document = expediente.get_document_file(db, user, program, application_id, document_id)
        return FileResponse(
            path,
            media_type="application/pdf",
            filename=document.original_filename or f"documento-{document.document_id}.pdf",
            content_disposition_type="attachment" if download else "inline",
        )

    @router.delete("/{application_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT, tags=tags)
    def delete_application_document(application_id: int, document_id: int, user: CurrentUser, db: DbSession):
        expediente.delete_document(db, user, program, application_id, document_id)

    @router.patch(
        "/{application_id}/documents/{document_id}/review", response_model=ApplicationDocumentOutput, tags=tags,
    )
    def review_application_document(
        application_id: int, document_id: int, data: DocumentReviewInput, admin: AdminUser, db: DbSession,
    ):
        """La coordinación aprueba el documento, lo marca con observaciones o lo regresa a revisión."""
        return expediente.review_document(db, admin, program, application_id, document_id, data)
