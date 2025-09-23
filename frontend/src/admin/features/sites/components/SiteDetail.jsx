import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeleteSite from '../hooks/useDeleteSite';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


function SiteDetail({ site, fetching, fetchError, refetch, siteId }) {    
  const navigate = useNavigate();
  const { deleteSite, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteSite();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowConfirmDelete(true);

  const handleConfirmDelete = async () => {
    if (!siteId) return;
    await deleteSite(siteId);
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
        title="No se pudo cargar la sede"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!site) {
    return (
      <DataLoadError
        title="Sede no disponible"
        message="No encontramos información para esta sede."
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
            <dt className="item-header">Nombre del sitio</dt>
            <dd className="item-text">{site.name}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Institución</dt>
            <dd className="item-text">{site.institution_id}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Ciudad</dt>
            <dd className="item-text">{site.city}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Dirección</dt>
            <dd className="item-text">{site.address}</dd>
          </div>

          <div className="item-row">
            <dt className="item-header">Jefe de enseñanza</dt>
            <dd className="item-text">{site.teaching_head_name}</dd>
          </div>

          <div className="item-row">
            <dt className="item-header">Email del jefe de enseñanza</dt>
            <dd className="item-text">
              <a href={`mailto:${site.teaching_head_email}`} className="text-blue-600 hover:underline">
                {site.teaching_head_email}
              </a>
            </dd>
          </div>

          <div className="item-row">
            <dt className="item-header">Teléfono del jefe de enseñanza</dt>
            <dd className="item-text">
              <a href={`tel:${site.teaching_head_phone}`} className="text-blue-600 hover:underline">
                {site.teaching_head_phone}
              </a>
            </dd>
          </div>

          <div className="item-row">
            <dt className="item-header">Subjefe de enseñanza</dt>
            <dd className="item-text">{site.teaching_deputy_name}</dd>
          </div>

          <div className="item-row">
            <dt className="item-header">Email del suplente</dt>
            <dd className="item-text">
              <a href={`mailto:${site.teaching_deputy_email}`} className="text-blue-600 hover:underline">
                {site.teaching_deputy_email}
              </a>
            </dd>
          </div>

          <div className="item-row">
            <dt className="item-header">Teléfono del suplente</dt>
            <dd className="item-text">
              <a href={`tel:${site.teaching_deputy_phone}`} className="text-blue-600 hover:underline">
                {site.teaching_deputy_phone}
              </a>
            </dd>
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
          message="Ocurrió un problema al eliminar la sede"
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
          {deleting ? 'Eliminando...' : 'Eliminar sede'}
        </button>
      </div>
    </div>
);
}

export default SiteDetail;