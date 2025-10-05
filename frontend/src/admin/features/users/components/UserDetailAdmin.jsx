import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function UserDetailAdmin({ user, fetching, fetchError, refetch, academicId }) {    
  const navigate = useNavigate();
  
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);
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
        message="No encontramos información para este usuario."
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
      <div className="item-container">
        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Nombre completo</dt>
            <dd className="item-text">
              {user.first_name} {user.last_name} {user.second_last_name}
            </dd>
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
            <dt className="item-header">Rol</dt>
            <dd className="item-text">{userAdmin.is_admin ? 'Administrador' : 'Alumno'}</dd>
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

      <div className="info-actions mt-16">
        <button 
          type="button" 
          className='btn-tertiary'
          onClick={handleDeleteButton}
          disabled={deleting}
        >
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>        
  );
}

export default UserDetailAdmin;
