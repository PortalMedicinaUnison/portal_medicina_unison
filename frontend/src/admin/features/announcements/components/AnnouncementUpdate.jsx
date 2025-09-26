import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateAnnouncement from '../hooks/useUpdateAnnouncement'
import { cleanFormData } from "../../../../utils/utils";
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const INITIAL_FORM = {
  title: '',
  description: '',
  announcementType: 0,
  isVisible: true,
};

function AnnouncementUpdate({ announcement, fetching, fetchError, refetch, announcementId }) {
  const navigate = useNavigate();
  const { updateAnnouncement, loading: saving, error: saveError, success: saved, reset } = useUpdateAnnouncement();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (validationError) return setValidationError('');
    if (saveError) return reset();
            
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!announcementId) {
        setValidationError('ID de anuncio no proporcionado.');
        return;
    }

    const cleanData = cleanFormData({
      ...formData,
      announcementType: Number(formData.announcementType),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanData.title) errors.push('El título es requerido.');
    if (!cleanData.description) errors.push('La descripción es requerida.');
    if (cleanData.announcementType === 0) errors.push('Seleccione un tipo de anuncio válido.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      title: cleanData.title,
      description: cleanData.description,
      announcement_type: cleanData.announcementType,
      is_visible: cleanData.isVisible,
    };
    
    const payload = {
      title: cleanData.title,
      description: cleanData.description,
      announcement_type: cleanData.announcementType,
      is_visible: cleanData.isVisible,
    };

    await updateAnnouncement(announcementId, payload);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        description: announcement.description || '',
        announcementType: announcement.announcementType ?? 0,
        isVisible: announcement.isVisible ?? true,
      });
    }
  }, [announcement]);

  useEffect(() => {
    if (saved) {
      navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_DETAIL(announcementId)));
    }
  }, [saved, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

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
    <form className="component-container" onSubmit={handleSubmit}>
      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {validationError || saveError}
            </span>
        </div>
      )}

      <div className="info-container">
        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">Título</dt>
              <dd className="item-text">
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Título del anuncio"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Contenido</dt>
              <dd className="item-text">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Descripción del anuncio"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
                <dt className="item-header">Ambito</dt>
                <dd className="item-text">
                  <select
                    name="announcementType"
                    value={formData.announcementType}
                    onChange={handleChange}
                    className="form-input--half"
                    disabled={saving}
                    required
                  >
                    <option value={0}>Seleccione un tipo</option>
                    <option value={1}>General</option>
                    <option value={2}>Internado</option>
                  </select>
                </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Visible</dt>
              <dd className="item-text">
                <input
                  name="isVisible"
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={handleChange}
                  className="form-checkbox"
                  disabled={saving}
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST))}
            disabled={saving}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default AnnouncementUpdate;