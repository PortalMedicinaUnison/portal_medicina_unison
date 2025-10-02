import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeletePromotion from '../hooks/useDeletePromotion';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function PromotionDetail({ promotion, fetching, fetchError, refetch, promotionId }) {    
  const navigate = useNavigate();
  const { deletePromotion, loading: deleting, success: deleted,  error: deleteError, reset } = useDeletePromotion();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!promotionId) return;
    await deletePromotion(promotionId);
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
  
  if (!promotion) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para esta promoción."
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
            <dt className="item-header">Año</dt>
            <dd className="item-text">{promotion.year}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Periodo</dt>
            <dd className="item-text">{promotion.period}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">  {promotion?.is_finished ? 'Finalizado' : 'No finalizado'}</dd>
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

export default PromotionDetail;
