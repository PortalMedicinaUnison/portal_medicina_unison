import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


function AnnouncementCard({ announcements, fetching, fetchError, refetch }) {
  const navigate = useNavigate();
  
  const ANNOUNCEMENT_TYPES = {
    1: 'General',
    2: 'Internado'
  };

  const getAnnouncementTypeName = (typeEnum) => {
    return ANNOUNCEMENT_TYPES[typeEnum] || 'Desconocido';
  };

  const getTypeBadgeColor = (typeEnum) => {
    const colors = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-purple-100 text-purple-800'
    };
    return colors[typeEnum] || 'bg-gray-100 text-gray-800';
  };

// ---------------------- HANDLERS ----------------------


// ---------------------- EFFECTS ----------------------



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
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="card"
        >
          {/* Header */}
          <div className="text-left mb-4">
            <span
              className={`card-badge ${getTypeBadgeColor(
                announcement.type
              )}`}
            >
              {getAnnouncementTypeName(announcement.type)}
            </span>
          </div>

          {/* Title */}
          <h3 className="card-title">
            {announcement.title}
          </h3>

          {/* Message/Description */}
          <p className="card-message">
            {announcement.message || announcement.description}
          </p>

          {/* Details */}
          {announcement.details && (
            <div className="card-details">
              {announcement.details}
            </div>
          )}

          {/* Footer Info */}
          <div className="card-footer">
            <span>
              {announcement.createdAt
                ? new Date(announcement.createdAt).toLocaleDateString('es-MX')
                : 'Fecha desconocida'}
            </span>
            {announcement.author && <span>{announcement.author}</span>}
          </div>          
        </div>
      ))}
    </div>
  );
}
    
export default AnnouncementCard;
