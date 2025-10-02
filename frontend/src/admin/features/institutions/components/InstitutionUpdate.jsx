import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateInstitution from '../hooks/useUpdateInstitution'
import { cleanFormData } from "../../../../utils/utils";
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const INITIAL_FORM = {
  name: '',
};

function InstitutionUpdate({ institution, fetching, fetchError, refetch, institutionId }) {
  const navigate = useNavigate();
  const { updateInstitution, loading: saving, error: saveError, success: saved, reset } = useUpdateInstitution();

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

    if (!institutionId) {
        setValidationError('ID de anuncio no proporcionado.');
        return;
    }

    const cleanedData = cleanFormData(formData);

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.name) errors.push('El nombre es obligatorio');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      name: cleanedData.name,
    };
    
    await updateInstitution(institutionId, payload);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name || '',
      });
    }
  }, [institution]);

  useEffect(() => {
    if (saved) {
      navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_DETAIL(institutionId)));
    }
  }, [saved, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la institución"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!institution) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para esta institución."
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
              <dt className="item-header">Razon social</dt>
              <dd className="item-text">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Razon social de la institución"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_LIST))}
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

export default InstitutionUpdate;