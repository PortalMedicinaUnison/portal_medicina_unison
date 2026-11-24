from typing import List, Optional

from fastapi import APIRouter, File, Form, UploadFile, status
from fastapi.responses import FileResponse

from controllers import social_service as controller
from core.dependencies import AdminUser, CurrentUser, DbSession
from models.internship import ApplicationStatusEnum
from models.social_service import SocialServiceDocumentTypeEnum, SocialServiceStatusEnum
from schemas.social_service import (
    SocialServiceApplicationInput, SocialServiceApplicationOutput, SocialServiceDocumentOutput,
    SocialServiceOutput, SocialServiceUpdate,
)

# ----------------------  SOCIAL SERVICE APPLICATION  ----------------------

social_service_application_router = APIRouter(
    prefix="/social-service-applications", tags=["Asignaciones de servicio social"],
)


@social_service_application_router.get("", response_model=List[SocialServiceApplicationOutput])
def list_applications(
    user: CurrentUser, db: DbSession,
    promotion_id: Optional[int] = None, academic_id: Optional[str] = None,
    status: Optional[ApplicationStatusEnum] = None,
):
    """Administradores: todas (con filtros). Estudiantes: solo las suyas, de la más reciente a la más antigua."""
    return controller.list_applications(db, user, promotion_id=promotion_id, academic_id=academic_id, status=status)


@social_service_application_router.post(
    "", response_model=SocialServiceApplicationOutput, status_code=status.HTTP_201_CREATED,
)
def create_application(data: SocialServiceApplicationInput, _admin: AdminUser, db: DbSession):
    """Requiere que el estudiante haya acreditado (finalizado) el internado."""
    return controller.create_application(db, data)


@social_service_application_router.get("/{application_id}", response_model=SocialServiceApplicationOutput)
def get_application(application_id: int, user: CurrentUser, db: DbSession):
    return controller.get_application(db, user, application_id)


@social_service_application_router.post("/{application_id}/accept", response_model=SocialServiceOutput)
def accept_application(application_id: int, user: CurrentUser, db: DbSession):
    """El estudiante acepta su asignación: se crea su servicio social (la plaza la asigna la coordinación)."""
    return controller.accept_application(db, user, application_id)


@social_service_application_router.post("/{application_id}/decline", response_model=SocialServiceApplicationOutput)
def decline_application(application_id: int, user: CurrentUser, db: DbSession):
    return controller.decline_application(db, user, application_id)


@social_service_application_router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, _admin: AdminUser, db: DbSession):
    controller.delete_application(db, application_id)


# ----------------------  SOCIAL SERVICE  ----------------------

social_service_router = APIRouter(prefix="/social-services", tags=["Servicio social"])


@social_service_router.get("", response_model=List[SocialServiceOutput])
def list_social_services(
    user: CurrentUser, db: DbSession,
    promotion_id: Optional[int] = None, site_id: Optional[int] = None,
    academic_id: Optional[str] = None, status: Optional[SocialServiceStatusEnum] = None,
):
    """Administradores: todos (con filtros). Estudiantes: solo los suyos, del más reciente al más antiguo."""
    return controller.list_social_services(
        db, user, promotion_id=promotion_id, site_id=site_id, academic_id=academic_id, status=status,
    )


@social_service_router.get("/{social_service_id}", response_model=SocialServiceOutput)
def get_social_service(social_service_id: int, user: CurrentUser, db: DbSession):
    return controller.get_social_service(db, user, social_service_id)


@social_service_router.patch("/{social_service_id}", response_model=SocialServiceOutput)
def update_social_service(social_service_id: int, data: SocialServiceUpdate, admin: AdminUser, db: DbSession):
    """Asigna o cambia la plaza (respetando el cupo) o el estatus (3 = liberado)."""
    return controller.update_social_service(db, admin, social_service_id, data)


@social_service_router.delete("/{social_service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_service(social_service_id: int, admin: AdminUser, db: DbSession):
    """Da de baja el servicio social; la asignación vuelve a quedar pendiente."""
    controller.delete_social_service(db, admin, social_service_id)


# ----------------------  SOCIAL SERVICE DOCUMENT  ----------------------

@social_service_router.get(
    "/{social_service_id}/documents", response_model=List[SocialServiceDocumentOutput], tags=["Documentos"],
)
def list_documents(social_service_id: int, user: CurrentUser, db: DbSession):
    return controller.list_documents(db, user, social_service_id)


@social_service_router.post(
    "/{social_service_id}/documents", response_model=SocialServiceDocumentOutput,
    status_code=status.HTTP_201_CREATED, tags=["Documentos"],
)
def upload_document(
    social_service_id: int, user: CurrentUser, db: DbSession,
    document_type: SocialServiceDocumentTypeEnum = Form(...), file: UploadFile = File(...),
):
    """Sube un PDF (máximo MAX_UPLOAD_MB). Solo puede haber un documento activo por tipo."""
    return controller.upload_document(db, user, social_service_id, document_type, file)


@social_service_router.get(
    "/{social_service_id}/documents/{document_id}", response_model=SocialServiceDocumentOutput, tags=["Documentos"],
)
def get_document(social_service_id: int, document_id: int, user: CurrentUser, db: DbSession):
    return controller.get_document(db, user, social_service_id, document_id)


@social_service_router.get(
    "/{social_service_id}/documents/{document_id}/file", response_class=FileResponse, tags=["Documentos"],
)
def get_document_file(social_service_id: int, document_id: int, user: CurrentUser, db: DbSession, download: bool = False):
    """Devuelve el PDF. `download=true` lo descarga; si no, se muestra en el navegador."""
    path, document = controller.get_document_file(db, user, social_service_id, document_id)
    return FileResponse(
        path,
        media_type="application/pdf",
        filename=document.original_filename or f"documento-{document.document_id}.pdf",
        content_disposition_type="attachment" if download else "inline",
    )


@social_service_router.delete(
    "/{social_service_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Documentos"],
)
def delete_document(social_service_id: int, document_id: int, user: CurrentUser, db: DbSession):
    controller.delete_document(db, user, social_service_id, document_id)
