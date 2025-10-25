import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


function SurveyCard({ surveys, fetching, fetchError, refetch }) {
  const navigate = useNavigate();

// ---------------------- FILTERS AND SEARCH ----------------------

  const ANNOUNCEMENT_TYPES = {
    1: 'General',
    2: 'Internado'
  };

  const getAnnouncementTypeName = (typeEnum) => {
    return ANNOUNCEMENT_TYPES[typeEnum] || 'Desconocido';
  };

  const getTypeBadgeColor = (typeEnum) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-purple-100 text-purple-800'
    };
    return colors[typeEnum] || 'bg-gray-100 text-gray-800';
  };

  const filtered = useMemo(() => {
    if (!surveys) return [];
    return surveys.filter((item) => item.is_visible === true);
  }, [surveys]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message="Intenta recargar la página."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------
  return (
    <div className="flex-1 space-y-6">
      {filtered.length === 0 ? (
          <div className="card">
            <h3 className="card-title">
              No hay encuestas disponibles
            </h3>
            <p className="card-message">
              Actualmente no hay encuestas para mostrar.
            </p>
          </div>
      ) : (
        filtered.map((item) => (
          <div key={item.announcement_id} className="card">
            
            {/* Header */}
            <div className="card-header">
              <span className={`card-badge ${getTypeBadgeColor(item.announcement_type)}`}>
                {getAnnouncementTypeName(item.announcement_type)}
              </span>
            </div>

            {/* Title */}
            <h3 className="card-title">
              {item.title}
            </h3>

            {/* Message/Description */}
            <p className="card-message">
              {item.message || item.description}
            </p>

            {/* Details */}
            {item.details && (
              <div className="card-details">
                {item.details}
              </div>
            )}

            {/* Footer Info */}
            <div className="card-footer">
              <span>
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString('es-MX')
                  : 'Sin fecha'}
              </span>
            </div>          
          </div>
        ))
      )}
    </div>
  );
}
    
export default SurveyCard;
