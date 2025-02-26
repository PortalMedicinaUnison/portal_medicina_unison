from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from schemas.user import UserInput, PreRegisteredUserInput
from core.dependencies import get_db
from controllers.user import *
# from controllers.user import (
#     create_user,
#     get_user,
#     update_user,
#     delete_user,
#     create_pre_registered_user,
#     get_pre_registered_user,
#     update_pre_registered_user,
#     delete_pre_registered_user,
# )


router_user = APIRouter(prefix="/users", tags=["Usuarios"])

@router_user.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user_input: UserInput, db: Session = Depends(get_db)):
    """
    Entrada: El endpoint recibe un JSON, FastAPI lo parsea y valida según UserInput.
    Procesamiento: El controller transforma el objeto Pydantic en el modelo ORM y llama al repository.
    Salida: Se transforma el resultado a diccionario y se envía la respuesta.
    """
    user = create_user(user_input, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el usuario")
    return user

@router_user.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(user_id, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return user

@router_user.put("/{user_id}")
def update_user(user_id: int, user_input: UserInput, db: Session = Depends(get_db)):
    user = update_user(user_id, user_input, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return user

@router_user.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    if not delete_user(user_id, db):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return

@router_user.post("/{user_id}/upload-profile-picture")
def upload_profile_picture(user_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Para la carga de imagen se delega la operación en el Repository.
    Se podría extender este endpoint con un controller si fuera necesaria más lógica.
    """
    from repositories.user_repo import UserRepo
    user_repo = UserRepo(db)
    updated_user = user_repo.upload_profile_picture(user_id, image)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return {
        "user_id": updated_user.user_id,
        "academic_id": updated_user.academic_id,
        "name": updated_user.name,
        "paternal_last_name": updated_user.paternal_last_name,
        "maternal_last_name": updated_user.maternal_last_name,
        "email": updated_user.email,
        "profile_photo": updated_user.profile_photo,
        "is_admin": updated_user.is_admin,
        "is_super_admin": updated_user.is_super_admin,
    }

# Router para Usuarios Pre-Registrados
router_pre_registered = APIRouter(prefix="/pre-registered-users", tags=["Usuarios Pre-Registrados"])

@router_pre_registered.post("/", status_code=status.HTTP_201_CREATED)
def create_pre_registered_user(user_input: PreRegisteredUserInput, db: Session = Depends(get_db)):
    user = create_pre_registered_user(user_input, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el usuario pre-registrado")
    return user

@router_pre_registered.get("/{academic_id}")
def get_pre_registered_user(academic_id: int, db: Session = Depends(get_db)):
    user = get_pre_registered_user(academic_id, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario pre-registrado no encontrado")
    return user

@router_pre_registered.put("/{academic_id}")
def update_pre_registered_user(academic_id: int, user_input: PreRegisteredUserInput, db: Session = Depends(get_db)):
    user = update_pre_registered_user(academic_id, user_input, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario pre-registrado no encontrado")
    return user

@router_pre_registered.delete("/{academic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pre_registered_user(academic_id: int, db: Session = Depends(get_db)):
    if not delete_pre_registered_user(academic_id, db):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario pre-registrado no encontrado")
    return
