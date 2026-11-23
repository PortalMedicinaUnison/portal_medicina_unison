from typing import List, Optional

from fastapi import APIRouter, File, Form, UploadFile, status
from fastapi.responses import FileResponse

from controllers import internship as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from models.internship import ApplicationStatusEnum, DocumentTypeEnum, InternshipStatusEnum
from schemas.internship import (
    InternshipApplicationInput, InternshipApplicationOutput, InternshipDocumentOutput,
    InternshipOutput, InternshipUpdate,
)

# ----------------------  INTERNSHIP APPLICATION  ----------------------

internship_application_router = APIRouter(prefix="/internship-applications", tags=["Asignaciones de internado"])


@internship_application_router.get("", response_model=List[InternshipApplicationOutput])
def list_applications(
    user: CurrentUser, db: DbSession,
    promotion_id: Optional[int] = None, academic_id: Optional[str] = None,
    status: Optional[ApplicationStatusEnum] = None,
):
    """Administradores: todas (con filtros). Estudiantes: solo las suyas, de la más reciente a la más antigua."""
    return controller.list_applications(db, user, promotion_id=promotion_id, academic_id=academic_id, status=status)


@internship_application_router.post("", response_model=InternshipApplicationOutput, status_code=status.HTTP_201_CREATED)
def create_application(data: InternshipApplicationInput, _admin: AdminUser, db: DbSession):
    return controller.create_application(db, data)


@internship_application_router.get("/{application_id}", response_model=InternshipApplicationOutput)
def get_application(application_id: int, user: CurrentUser, db: DbSession):
    return controller.get_application(db, user, application_id)


@internship_application_router.post("/{application_id}/accept", response_model=InternshipOutput)
def accept_application(application_id: int, user: CurrentUser, db: DbSession):
    """El estudiante acepta su asignación: se crea su internado (sin sede, la asigna la coordinación)."""
    return controller.accept_application(db, user, application_id)


@internship_application_router.post("/{application_id}/decline", response_model=InternshipApplicationOutput)
def decline_application(application_id: int, user: CurrentUser, db: DbSession):
    return controller.decline_application(db, user, application_id)


@internship_application_router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_application(db, application_id)


# ----------------------  INTERNSHIP  ----------------------

internship_router = APIRouter(prefix="/internships", tags=["Internados"])


@internship_router.get("", response_model=List[InternshipOutput])
def list_internships(
    user: CurrentUser, db: DbSession,
    promotion_id: Optional[int] = None, site_id: Optional[int] = None,
    academic_id: Optional[str] = None, status: Optional[InternshipStatusEnum] = None,
):
    """Administradores: todos (con filtros). Estudiantes: solo los suyos, del más reciente al más antiguo."""
    return controller.list_internships(
        db, user, promotion_id=promotion_id, site_id=site_id, academic_id=academic_id, status=status,
    )


@internship_router.get("/{internship_id}", response_model=InternshipOutput)
def get_internship(internship_id: int, user: CurrentUser, db: DbSession):
    return controller.get_internship(db, user, internship_id)


@internship_router.patch("/{internship_id}", response_model=InternshipOutput)
def update_internship(internship_id: int, data: InternshipUpdate, admin: AdminUser, db: DbSession):
    """Asigna o cambia la sede (respetando el cupo) o el estatus del internado."""
    return controller.update_internship(db, admin, internship_id, data)


@internship_router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(internship_id: int, admin: AdminUser, db: DbSession):
    """Da de baja el internado; la asignación vuelve a quedar pendiente."""
    controller.delete_internship(db, admin, internship_id)


# ----------------------  INTERNSHIP DOCUMENT  ----------------------

@internship_router.get("/{internship_id}/documents", response_model=List[InternshipDocumentOutput], tags=["Documentos"])
def list_documents(internship_id: int, user: CurrentUser, db: DbSession):
    return controller.list_documents(db, user, internship_id)


@internship_router.post(
    "/{internship_id}/documents", response_model=InternshipDocumentOutput,
    status_code=status.HTTP_201_CREATED, tags=["Documentos"],
)
def upload_document(
    internship_id: int, user: CurrentUser, db: DbSession,
    document_type: DocumentTypeEnum = Form(...), file: UploadFile = File(...),
):
    """Sube un PDF (máximo MAX_UPLOAD_MB). Solo puede haber un documento activo por tipo."""
    return controller.upload_document(db, user, internship_id, document_type, file)


@internship_router.get("/{internship_id}/documents/{document_id}", response_model=InternshipDocumentOutput, tags=["Documentos"])
def get_document(internship_id: int, document_id: int, user: CurrentUser, db: DbSession):
    return controller.get_document(db, user, internship_id, document_id)


@internship_router.get("/{internship_id}/documents/{document_id}/file", response_class=FileResponse, tags=["Documentos"])
def get_document_file(internship_id: int, document_id: int, user: CurrentUser, db: DbSession, download: bool = False):
    """Devuelve el PDF. `download=true` lo descarga; si no, se muestra en el navegador."""
    path, document = controller.get_document_file(db, user, internship_id, document_id)
    return FileResponse(
        path,
        media_type="application/pdf",
        filename=document.original_filename or f"documento-{document.document_id}.pdf",
        content_disposition_type="attachment" if download else "inline",
    )


@internship_router.delete("/{internship_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Documentos"])
def delete_document(internship_id: int, document_id: int, user: CurrentUser, db: DbSession):
    controller.delete_document(db, user, internship_id, document_id)
