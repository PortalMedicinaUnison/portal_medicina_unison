import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeleteSurvey from '../hooks/useDeleteSurvey';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function SurveyDetail({ survey, fetching, fetchError, refetch, surveyId }) {    
  const navigate = useNavigate();
  const { deleteSurvey, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteSurvey();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!surveyId) return;
    await deleteSurvey(surveyId);
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
  
  if (!survey) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para esta encuesta."
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
            <dt className="item-header">Título de la encuesta</dt>
            <dd className="item-text">{survey.title}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Enlace</dt>
            <dd className="item-text">{survey.url}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Descripción</dt>
            <dd className="item-text">{survey.description}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Fecha de vencimiento</dt>
            <dd className="item-text">{survey.expiration_date}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Obligatoriedad</dt>
            <dd className="item-text">{survey.mandatory}</dd>
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

export default SurveyDetail;
