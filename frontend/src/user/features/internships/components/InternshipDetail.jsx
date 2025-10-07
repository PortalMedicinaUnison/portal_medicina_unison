import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import DocumentList from '../documents/components/DocumentList'


function InternshipDetail({ internship, fetching, fetchError, refetch, internshipId }) {    
  const navigate = useNavigate();
  
  const INTERNSHIP_STATUS = {
    1: 'Activo',
    2: 'Suspendido',
    3: 'Finalizado',
  };

  const getInternshipStatusName = (typeEnum) => {
    return INTERNSHIP_STATUS[typeEnum] || 'Desconocido';
  };

// ---------------------- HANDLERS ----------------------


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
            <dt className="item-header">Promoción</dt>
            <dd className="item-text">
              {internship.application.promotion.year} - {internship.application.promotion.period}
            </dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Sede</dt>
            <dd className="item-text">{internship?.site?.name ?? 'Sin asignar'}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Estatus</dt>
            <dd className="item-text">{getInternshipStatusName(internship?.status)}</dd>
          </div>
        </dl>
      </div>

      <div className='mt-16'>
          <DocumentList/>
      </div>

    </div>        
  );
}

export default InternshipDetail;
