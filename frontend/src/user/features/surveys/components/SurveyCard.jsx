import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/utils';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import { isHttpUrl } from '../../../../utils/validations';



function SurveyCard({ surveys, fetching, fetchError, refetch }) {
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
      {!surveys || surveys.length === 0 ? (
          <div className="card">
            <h3 className="card-title">
              No hay encuestas disponibles
            </h3>
            <p className="card-message">
              Actualmente no hay encuestas para responder.
            </p>
          </div>
      ) : (
        surveys.map((item) => (
          <div key={item.survey_id} className="card">

            {/* Header */}
            {item.mandatory && (
              <div className="card-header">
                <span className="card-badge bg-red-100 text-red-800">
                  Obligatoria
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="card-title">
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p className="card-message whitespace-pre-line">
                {item.description}
              </p>
            )}

            {/* Footer Info */}
            <div className="card-footer items-center gap-4">
              <span>
                Disponible hasta el {formatDate(item.expiration_date)}
              </span>
              {isHttpUrl(item.url) && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Responder encuesta
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SurveyCard;
