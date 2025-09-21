import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateAnnouncement from '../hooks/useUpdateAnnouncement'
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const INITIAL_FORM = {
  title: '',
  description: '',
  announcement_type: 0,
  is_visible: true,
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

    const data = {
      ...formData,
      announcement_type: Number(formData.announcement_type),
    };

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];

    if (!data.title.trim()) errors.push('El título es requerido.');
    if (!data.description.trim()) errors.push('La descripción es requerida.');
    if (data.announcement_type === 0) errors.push('Seleccione un tipo de anuncio válido.');
    
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }
    
    await updateAnnouncement(announcementId, data);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        description: announcement.description || '',
        announcement_type: announcement.announcement_type ?? 0,
        is_visible: announcement.is_visible ?? true,
      });
    }
  }, [announcement]);

  useEffect(() => {
    if (saved) {
      const redirectTimeout = setTimeout(() => {
        setFormData(INITIAL_FORM);
        navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST));
        reset();
      }, 1000);
      return () => clearTimeout(redirectTimeout);
    }
  }, [saved, navigate, reset]);

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
      {saved && (
        <div className="alert-success">
          Anuncio registrado exitosamente.
        </div>
      )}

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
                  type="text"
                  name="title"
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
                    name="announcement_type"
                    value={formData.announcement_type}
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
                  type="checkbox"
                  name="is_visible"
                  checked={formData.is_visible}
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