import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateAnnouncement from '../hooks/useCreateAnnouncement';
import { cleanFormData } from "../../../../utils/utils";
import { ANNOUNCEMENT_TYPE_LABELS } from '../../../../utils/constants';


const INITIAL_FORM = {
  title: '',
  description: '',
  announcementType: 0,
  isVisible: true,
};

function AnnouncementForm() {
  const navigate = useNavigate();
  const { createAnnouncement, loading: saving, success: saved, error: saveError, reset } = useCreateAnnouncement();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [createdId, setCreatedId] = useState(null);
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

    const cleanedData = cleanFormData({
      ...formData,
      announcementType: Number(formData.announcementType),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.title) errors.push('El título es requerido.');
    if (!cleanedData.description) errors.push('La descripción es requerida.');
    if (cleanedData.announcementType === 0) errors.push('Selecciona el ámbito del aviso.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      title: cleanedData.title,
      description: cleanedData.description,
      announcement_type: cleanedData.announcementType,
      is_visible: cleanedData.isVisible,
    };
    
    const response = await createAnnouncement(payload);
    if (response && response.data.announcement_id) {
      setCreatedId(response.data.announcement_id);
    }
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (saved) {
      setFormData(INITIAL_FORM);

      const alertTimeout = setTimeout(() => {
        reset();
      }, 10000);
      return () => clearTimeout(alertTimeout);
    }
  }, [saved, reset]);

// ---------------------- LOADING & ERROR STATES ----------------------

    
// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {saved && (
        <div className="alert-success">
          Aviso registrado exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_DETAIL(createdId))}
              className="font-bold underline"
            >
              Ver
            </Link>
          )}
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
              <dt className="item-header"><label htmlFor="announcement-title">Título</label></dt>
              <dd className="item-text">
                <input
                  id="announcement-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Título del aviso"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="announcement-description">Contenido</label></dt>
              <dd className="item-text">
                <textarea
                  id="announcement-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Contenido del aviso"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
                <dt className="item-header"><label htmlFor="announcement-type">Ámbito</label></dt>
                <dd className="item-text">
                  <select
                    id="announcement-type"
                    name="announcementType"
                    value={formData.announcementType}
                    onChange={handleChange}
                    className="form-input--half"
                    disabled={saving}
                    required
                  >
                    <option value={0}>Seleccionar tipo</option>
                    {Object.entries(ANNOUNCEMENT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="announcement-is-visible">Visible</label></dt>
              <dd className="item-text">
                <input
                  id="announcement-is-visible"
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

export default AnnouncementForm;