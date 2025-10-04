import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeleteEnrollment from '../hooks/useDeleteEnrollment';
import LoadingSpinner from '../../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../../utils/ui/DataLoadError';
import Modal from '../../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../../utils/ui/ConfirmDialogContent';


function EnrollmentDetail({ enrollment, fetching, fetchError, refetch, enrollmentId }) {    
  const navigate = useNavigate();
  const { deleteEnrollment, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteEnrollment();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!enrollmentId) return;
    await deleteEnrollment(enrollmentId);
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
  
  if (!enrollment) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para este pre-registro."
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
            <dt className="item-header">Expediente</dt>
            <dd className="item-text">{enrollment.academic_id}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{enrollment.is_enrolled ? 'Inscrito' : 'No inscrito'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Ultima fecha de actualización</dt>
            <dd className="item-text">{enrollment.updated_at}</dd>
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
          onClick={handleDeleteButton}
          disabled={deleting}
        >
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>        
  );
}

export default EnrollmentDetail;
