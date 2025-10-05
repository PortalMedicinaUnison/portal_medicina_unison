import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeleteUser from '../hooks/useDeleteUser';
import LoadingSpinner from '../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../utils/ui/DataLoadError';
import Modal from '../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../utils/ui/ConfirmDialogContent';


function UserDetail({ user, fetching, fetchError, refetch, userId }) {    
  const navigate = useNavigate();
  const { deleteUser, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteUser();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!userId) return;
    await deleteUser(userId);
  };
  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------
    
  useEffect(() => {
    if (deleted) {
      setShowConfirmDelete(false);
      reset();
      navigate(-1);
    }
  }
  , [deleted, navigate, reset]);

  useEffect(() => {
    if (deleteError) {
      setShowConfirmDelete(false);
      setShowErrorDialog(true);
    }
  }, [deleteError]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!user) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información de este usuario."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------

  return (
    <div className="info-container">
      <div className="user-info-photo">
        <img 
          src={user.profile_photo || "/default-avatar.png"} 
          alt="Foto de perfil" 
          className="user-profile-photo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
        />
      </div>

      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Nombre completo</dt>
            <dd className="item-text">
              {user.first_name} {user.last_name} {user.second_last_name}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Rol</dt>
            <dd className="item-text">{user.is_admin ? 'Administrador' : 'Estudiante'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Expediente</dt>
            <dd className="item-text">{user.academic_id}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Correo electrónico</dt>
            <dd className="item-text">{user.email}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Teléfono</dt>
            <dd className="item-text">{user.phone_number}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Internado</dt>
            <dd className="item-text">{user.internship_id}</dd>
          </div>
        </dl>
      </div>

      <Modal open={showConfirmDelete} onClose={handleCloseConfirm}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar?"
          onConfirm={handleConfirmDelete}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          onCancel={handleCloseConfirm}
          danger
        />
      </Modal>

      <Modal open={showErrorDialog} onClose={handleCloseError}>
        <ConfirmDialogContent
          title="Ops... Ha ocurrido un error"
          message="Ocurrió un problema al eliminar el registro"
          onConfirm={handleCloseError}
          primaryLabel="Aceptar"
        />
      </Modal>

      <div className="info-actions mt-16">
        <button 
          type="button" 
          className='btn-tertiary'
        >
          Cambiar contraseña
        </button>
        <button 
          type="button" 
          className='btn-tertiary'
          onClick={handleDeleteButton}
          disabled={deleting}
        >
          {deleting ? 'Eliminando...' : 'Desactivar mi cuenta'}
        </button>
      </div>
    </div>        
  );
}

export default UserDetail;
