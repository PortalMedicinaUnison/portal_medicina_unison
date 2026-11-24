import { useNavigate } from 'react-router-dom';
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_TYPE_LABELS, labelOf } from '../../../../utils/constants';
import { formatDateTime } from '../../../../utils/utils';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const TYPE_BADGE_COLORS = {
  [ANNOUNCEMENT_TYPES.GENERAL]: 'bg-green-100 text-green-800',
  [ANNOUNCEMENT_TYPES.INTERNSHIP]: 'bg-purple-100 text-purple-800',
};

const getTypeBadgeColor = (type) => TYPE_BADGE_COLORS[Number(type)] || 'bg-gray-100 text-gray-800';

function AnnouncementCard({ announcements, fetching, fetchError, refetch }) {
  const navigate = useNavigate();

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------
  return (
    <div className="flex-1 space-y-6">
      {!announcements || announcements.length === 0 ? (
          <div className="card">
            <h3 className="card-title">
              No hay avisos disponibles
            </h3>
            <p className="card-message">
              Actualmente no hay avisos para mostrar.
            </p>
          </div>
      ) : (
        announcements.map((item) => (
          <div key={item.announcement_id} className="card">

            {/* Header */}
            <div className="card-header">
              <span className={`card-badge ${getTypeBadgeColor(item.announcement_type)}`}>
                {labelOf(ANNOUNCEMENT_TYPE_LABELS, item.announcement_type)}
              </span>
            </div>

            {/* Title */}
            <h3 className="card-title">
              {item.title}
            </h3>

            {/* Description */}
            <p className="card-message whitespace-pre-line">
              {item.description}
            </p>

            {/* Footer Info */}
            <div className="card-footer">
              <span>
                {formatDateTime(item.created_at)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AnnouncementCard;
