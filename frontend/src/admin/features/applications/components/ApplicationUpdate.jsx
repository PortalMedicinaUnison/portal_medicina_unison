import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateApplication from '../hooks/useUpdateApplication'
import { cleanFormData } from "../../../../utils/utils";
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const INITIAL_FORM = {
  academicId: '',
  isAccepted: false,
};

function ApplicationUpdate({ announcement, fetching, fetchError, refetch, applicationId }) {
  const navigate = useNavigate();
  const { updateApplication, loading: saving, error: saveError, success: saved, reset } = useUpdateApplication();

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

    if (!applicationId) {
        setValidationError('ID de la aplicación al internado no proporcionado.');
        return;
    }

    const cleanedData = cleanFormData(formData);

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.isAccepted) errors.push('Debe aceptar los términos y condiciones');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = { ...cleanedData };
    
    await updateApplication(applicationId, payload);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (announcement) {
      setFormData({
        academicId: announcement.academicId || '',
        isAccepted: announcement.isAccepted || false,
      });
    }
  }, [announcement]);

  useEffect(() => {
    if (saved) {
      navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_DETAIL(applicationId)));
    }
  }, [saved, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar el aplicación al internado"
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
        title="404"
        message="No encontramos información para esta aplicación al internado."
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
              <dt className="item-header">Confirmar mi intención al internado</dt>
              <dd className="item-text">
                <input
                  name="isAccepted"
                  type="checkbox"
                  checked={formData.isAccepted}
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
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_LIST))}
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

export default ApplicationUpdate;