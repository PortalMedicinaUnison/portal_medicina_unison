import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateSite from "../hooks/useUpdateSite.js";
import useGetInstitutions from "../../institutions/hooks/useGetInstitutions.js";
import { cleanFormData } from "../../../../utils/utils";
import { SONORA_MUNICIPALITIES } from "../../../../utils/constants.js";
import { isValidCity } from "../../../../utils/validations.js";
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';

const INITIAL_FORM = {
  name: '',
  institutionId: '',
  address: '',
  city: '',
  teachingHeadName: '',
  teachingHeadEmail: '',
  teachingHeadPhone: '',
  teachingDeputyName: '',
  teachingDeputyEmail: '',
  teachingDeputyPhone: '',
};

function SiteUpdate({ site, fetching, fetchError, refetch, siteId }) {
  const navigate = useNavigate();
  const { updateSite, loading: saving, success: saved, error: saveError, reset } = useUpdateSite();
  const { institutions, loading: fetchingInstitutions, error: institutionsError } = useGetInstitutions();

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

    const data = cleanFormData(formData);

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!data.name) errors.push('La razon social es requerida');
    if (!data.institutionId) errors.push('La institución es requerida');
    if (!data.address) errors.push('La dirección es requerida');
    if (data.city) errors.push('La ciudad no es válida');
    if (data.city && !isValidCity(data.city)) errors.push('La ciudad no es válida');
    if (!data.teachingHeadName) errors.push('El nombre del jefe de enseñanza es requerido');
    if (!data.teachingDeputyName) errors.push('El nombre del subjefe de enseñanza es requerido');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }
    
    await updateSite(siteId, data);
  };

// ---------------------- EFFECTS ----------------------

useEffect(() => {
  if (site) {
    setFormData({
      name: site.name || '',
      institutionId: site.institutionId || '',
      address: site.address || '',
      city: site.city || '',
      teachingHeadName: site.teachingHeadName || '',
      teachingHeadEmail: site.teachingHeadEmail || '',
      teachingHeadPhone: site.teachingHeadPhone || '',
      teachingDeputyName: site.teachingDeputyName || '',
      teachingDeputyEmail: site.teachingDeputyEmail || '',
      teachingDeputyPhone: site.teachingDeputyPhone || '',
    });
  }
}, [site]);

useEffect(() => {
  if (saved) {
    navigate(adminAbs(ROUTES.ADMIN.SITE_DETAIL(siteId)));
  }
}, [saved, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la sede"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!site) {
    return (
      <DataLoadError
        title="Sede no disponible"
        message="No encontramos información para esta sede."
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
                  placeholder="Razon social"
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Institución</dt>
              <dd className="item-text">
                <select
                  name="institutionId"
                  value={formData.institutionId}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={fetchingInstitutions || saving || institutionsError}
                  required
                >
                  <option value="">Seleccionar institución</option>
                  {institutions.map(institution => (
                    <option key={institution.institution_id} value={institution.institution_id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Dirección</dt>
              <dd className="item-text">
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Dirección"
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Ciudad</dt>
              <dd className="item-text">
                <select
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={saving}
                  required
                >
                  <option value="">Seleccionar municipio</option>
                  {SONORA_MUNICIPALITIES.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Jefe de enseñanza</dt>
              <dd className="item-text">
                <input
                  name="teachingHeadName"
                  type="text"
                  value={formData.teachingHeadName}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Jefe de enseñanza"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Jefe de ensañanza (email)</dt>
              <dd className="item-text">
                <input
                  name="teachingHeadEmail"
                  type="text"
                  value={formData.teachingHeadEmail}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Correo electrónico del jefe de enseñanza"
                  disabled={saving}
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Jefe de ensañanza (telefono)</dt>
              <dd className="item-text">
                <input
                  name="teachingHeadPhone"
                  type="text"
                  value={formData.teachingHeadPhone}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Teléfono del jefe de enseñanza"
                  disabled={saving}
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Subjefe de enseñanza</dt>
              <dd className="item-text">
                <input
                  name="teachingDeputyName"
                  type="text"
                  value={formData.teachingDeputyName}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Subjefe de enseñanza"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Subjefe de ensañanza (email)</dt>
              <dd className="item-text">
                <input
                  name="teachingDeputyEmail"
                  type="text"
                  value={formData.teachingDeputyEmail}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Correo electrónico del subjefe de enseñanza"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Jefe de ensañanza (telefono)</dt>
              <dd className="item-text">
                <input
                  name="teachingDeputyPhone"
                  type="text"
                  value={formData.teachingDeputyPhone}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Teléfono del subjefe de enseñanza"
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
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.SITE_LIST))}
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

export default SiteUpdate;
