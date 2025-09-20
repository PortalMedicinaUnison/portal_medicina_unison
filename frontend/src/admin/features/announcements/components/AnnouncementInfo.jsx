import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnnouncement } from '../hooks/useAnnouncement';
import useDeleteAnnouncement from '../hooks/useDeleteAnnouncement';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const ANNOUNCEMENT_TYPES = {
  1: 'General',
  2: 'Pasantía'
};

const getAnnouncementTypeName = (typeEnum) => {
  return ANNOUNCEMENT_TYPES[typeEnum] || 'Desconocido';
};

function AnnouncementDetail() {    
  const navigate = useNavigate();
  const { announcementId } = useParams();
  const { announcement, loading: fetching, error: fetchError, refetch } = useAnnouncement(announcementId);
  const { deleteAnnouncement, loading: deleting, success: deleted,  error: deleteError, reset } = useDeleteAnnouncement();

// ---------------------- HANDLERS ----------------------

  const handleDeleteButton = () => {
    const userConfirmation = window.confirm('Este aviso se eliminará. ¿Deseas continuar?');
    if (!userConfirmation) return;
    deleteAnnouncement(announcementId);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (deleted) {
      reset();
      navigate(-1);
    }
  }, [deleted, refetch, reset]);
    
  useEffect(() => {
    if (deleteError) {
      alert(`Error al eliminar el aviso: ${deleteError}`);
      reset();
    }
  }, [deleteError, reset]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching || deleting) {
    return <LoadingSpinner />;
  }

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

      <div className="info-actions mt-16">
        <button 
          type="button" 
          className='btn-tertiary'
          onClick={handleDeleteButton}
        >
          Eliminar Anuncio
        </button>
      </div>
    </div>        
  );
}

export default AnnouncementDetail;
