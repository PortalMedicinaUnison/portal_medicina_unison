import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateSurvey from '../hooks/useCreateSurvey';
import { cleanFormData } from "../../../../utils/utils";


const INITIAL_FORM = {
  title: '',
  url: '',
  description: '',
  expirationDate: '',
  mandatory: false,
};

function SurveyForm() {
  const navigate = useNavigate();
  const { createSurvey, loading: saving, success: saved, error: saveError, reset } = useCreateSurvey();

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

    const cleanedData = cleanFormData(formData);

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.title) errors.push('El título es obligatorio.');
    if (!cleanedData.url) errors.push('La URL de la encuesta es obligatoria.');
    if (!cleanedData.description) errors.push('La descripción es obligatoria.');
    if (!cleanedData.expirationDate) errors.push('La fecha de expiración es obligatoria.');
    if (new Date(cleanedData.expirationDate) <= new Date()) errors.push('La fecha de expiración debe ser una fecha futura.');
    if (cleanedData.mandatory === undefined || cleanedData.mandatory === null) {
        errors.push('Debe indicar si la encuesta es obligatoria o no.');
      }            
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      title: cleanedData.title,
      url: cleanedData.url,
      description: cleanedData.description,
      expiration_date: cleanedData.expirationDate,
      mandatory: cleanedData.mandatory,  
    };
    
    const response = await createSurvey(payload);
    if (response && response.data.survey_id) {
      setCreatedId(response.data.survey_id);
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
          Encuesta registrada exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.SURVEY_DETAIL(createdId))}
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
              <dt className="item-header">Título</dt>
              <dd className="item-text">
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Título de la encuesta"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">URL</dt>
              <dd className="item-text">
                <input
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="https://ejemplo.com/encuesta"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Descripción</dt>
              <dd className="item-text">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="form-input--half"
                  placeholder="Descripción de la encuesta"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
                <dt className="item-header">Fecha de vencimiento</dt>
                <dd className="item-text">
                  <input
                    name="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    className="form-input--half"
                    disabled={saving}
                    required
                  />
                </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">¿Obligatoria?</dt>
              <dd className="item-text">
                <input
                  name="mandatory"
                  type="checkbox"
                  checked={formData.mandatory}
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
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.SURVEY_LIST))}
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

export default SurveyForm;