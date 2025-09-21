import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeleteAnnouncement from '../hooks/useDeleteAnnouncement';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';


const ANNOUNCEMENT_TYPES = {
  1: 'General',
  2: 'Internado'
};

const getAnnouncementTypeName = (typeEnum) => {
  return ANNOUNCEMENT_TYPES[typeEnum] || 'Desconocido';
};

function AnnouncementDetail({ announcement, fetching, fetchError, refetch, announcementId }) {    
  const navigate = useNavigate();
  const { deleteAnnouncement, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteAnnouncement();
  
  const [showDialog, setShowDialog] = useState(false);

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => setShowDialog(true);

  const handleConfirmDelete = async () => {
    await deleteAnnouncement(announcementId);
    handleClose();
  };

  const handleClose = () => {
    setShowDialog(false);
  };  

// ---------------------- EFFECTS ----------------------
    
  useEffect(() => {
    if (deleted) {
      reset();
      navigate(-1);
    }
  }
  , [deleted, navigate, reset]);

  useEffect(() => {
    if (deleteError) {
      alert(`Error al eliminar el aviso: ${deleteError}`);
      reset();
    }
  }, [deleteError, reset]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar el anuncio"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!announcement) {
    return (
      <DataLoadError
        title="Anuncio no disponible"
        message="No encontramos información para este anuncio."
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
            <dt className="item-header">Título del anuncio</dt>
            <dd className="item-text">{announcement.title}</dd>
          </div>
          <div className="item-row">
            <dt className="item-header">Descripción</dt>
            <dd className="item-text">{announcement.description}</dd>
          </div>

          <div className="item-row">
            <dt className="item-header">Tipo de Anuncio</dt>
            <dd className="item-text">{getAnnouncementTypeName(announcement.announcement_type)}</dd>
          </div>
        </dl>
      </div>

      <Modal open={showDialog} onClose={handleClose}>
        <ConfirmDialogContent
          title="Confirmar eliminación"
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este anuncio?"
          onConfirm={handleConfirmDelete}
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          onCancel={handleClose}
          danger
        />
      </Modal>

      <div className="info-actions mt-16">
        <button 
          type="button" 
          className='btn-tertiary'
          onClick={handleDeleteButton}
        >
          {deleting ? 'Eliminando...' : 'Eliminar anuncio'}
        </button>
      </div>
    </div>        
  );
}

export default AnnouncementDetail;
