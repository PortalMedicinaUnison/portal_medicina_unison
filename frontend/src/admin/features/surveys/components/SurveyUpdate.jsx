import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateSurvey from '../hooks/useUpdateSurvey';
import { cleanFormData, todayISO } from "../../../../utils/utils";
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const INITIAL_FORM = {
  title: '',
  url: '',
  description: '',
  expirationDate: '',
  mandatory: false,
  isVisible: true,
};

function SurveyUpdate({ survey, fetching, fetchError, refetch, surveyId }) {
  const navigate = useNavigate();
  const { updateSurvey, loading: saving, success: saved, error: saveError, reset } = useUpdateSurvey();

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

    if (!surveyId) {
        setValidationError('ID de encuesta no proporcionado.');
        return;
    }

    const cleanedData = cleanFormData(formData);
    // Una encuesta ya vencida puede editarse sin tocar su fecha: solo se valida y se envía
    // `expiration_date` si cambió (el backend rechaza fechas anteriores a hoy).
    const dateChanged = cleanedData.expirationDate !== (survey?.expiration_date ?? '');

    // ---------------------- VALIDATIONS ----------------------
    // Las fechas 'YYYY-MM-DD' se comparan como texto: `new Date('YYYY-MM-DD')` es medianoche UTC
    // y rechazaría el día de hoy. El backend acepta hoy o una fecha posterior.
    const errors = [];
    if (!cleanedData.title) errors.push('El título es obligatorio.');
    if (!cleanedData.url) errors.push('La URL de la encuesta es obligatoria.');
    else if (!/^https?:\/\//i.test(cleanedData.url)) errors.push('La URL debe empezar con http:// o https://.');
    if (!cleanedData.expirationDate) errors.push('La fecha de vencimiento es obligatoria.');
    else if (dateChanged && cleanedData.expirationDate < todayISO()) errors.push('La fecha de vencimiento no puede ser anterior a hoy.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      title: cleanedData.title,
      url: cleanedData.url,
      description: cleanedData.description,
      mandatory: cleanedData.mandatory,
      is_visible: cleanedData.isVisible,
    };
    if (dateChanged) payload.expiration_date = cleanedData.expirationDate;

    await updateSurvey(surveyId, payload);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title || '',
        url: survey.url || '',
        description: survey.description || '',
        expirationDate: survey.expiration_date || '',
        mandatory: survey.mandatory ?? false,
        isVisible: survey.is_visible ?? true,
      });
    }
  }, [survey]);

  useEffect(() => {
    if (saved) {
      navigate(adminAbs(ROUTES.ADMIN.SURVEY_DETAIL(surveyId)));
    }
  }, [saved, navigate, surveyId]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la encuesta"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!survey) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para esta encuesta."
        onRetry={refetch}
        retryLabel='Recargar'
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

// ---------------------- RENDER ----------------------

  // Si la encuesta ya venció, su fecha original sigue siendo válida mientras no se cambie.
  const today = todayISO();
  const minExpirationDate = survey.expiration_date && survey.expiration_date < today
    ? survey.expiration_date
    : today;

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
                  placeholder="Descripción de la encuesta (opcional)"
                  disabled={saving}
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
                    min={minExpirationDate}
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

export default SurveyUpdate;
