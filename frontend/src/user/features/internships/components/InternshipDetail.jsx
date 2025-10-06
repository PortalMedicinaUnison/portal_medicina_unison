import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function InternshipDetail({ internship, fetching, fetchError, refetch, internshipId }) {    
  const navigate = useNavigate();
  
// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!internshipId) return;
  };
  const handleCloseConfirm = () => setShowConfirmDelete(false);

  const handleCloseError = () => {
    setShowErrorDialog(false);
    reset();
  };

// ---------------------- EFFECTS ----------------------
    

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
  
  if (!internship) {
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
            <dd className="item-text">{internship.year}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Periodo</dt>
            <dd className="item-text">{internship.period}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">  {internship?.is_finished ? 'Finalizado' : 'No finalizado'}</dd>
          </div>
        </dl>
      </div>

      <div className="info-actions mt-16">
        <button 
          type="button" 
          className='btn-tertiary'
          onClick={handleDeleteButton}
        >
          {'Eliminar'}
        </button>
      </div>
    </div>        
  );
}

export default InternshipDetail;
