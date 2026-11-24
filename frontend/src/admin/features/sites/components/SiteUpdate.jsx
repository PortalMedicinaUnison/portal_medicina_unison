import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdateSite from "../hooks/useUpdateSite.js";
import useGetInstitutions from "../../institutions/hooks/useGetInstitutions.js";
import { cleanFormData } from "../../../../utils/utils";
import { SONORA_MUNICIPALITIES } from "../../../../utils/constants.js";
import { validateEmail } from "../../../../utils/validations.js";
import SiteProgramsField from "./SiteProgramsField.jsx";
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
  forInternship: true,
  forSocialService: true,
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

    if (!siteId) {
      setValidationError('ID de sede no proporcionado.');
      return;
    }

    const cleanedData = cleanFormData({
      ...formData,
      institutionId: Number(formData.institutionId),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.name) errors.push('El nombre de la sede es obligatorio.');
    if (!cleanedData.institutionId) errors.push('La institución es requerida.');
    if (!cleanedData.address) errors.push('La dirección es requerida.');
    if (!cleanedData.city) errors.push('El municipio es obligatorio.');
    if (!cleanedData.teachingHeadName) errors.push('El nombre del jefe de enseñanza es requerido.');
    if (cleanedData.teachingHeadEmail && !validateEmail(cleanedData.teachingHeadEmail).valid) {
      errors.push('El correo del jefe de enseñanza no es válido.');
    }
    if (cleanedData.teachingDeputyEmail && !validateEmail(cleanedData.teachingDeputyEmail).valid) {
      errors.push('El correo del subjefe de enseñanza no es válido.');
    }
    if (!cleanedData.forInternship && !cleanedData.forSocialService) {
      errors.push('Marca si la sede ofrece cupos para el internado, el servicio social o ambos.');
    }
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      name: cleanedData.name,
      institution_id: cleanedData.institutionId,
      address: cleanedData.address,
      city: cleanedData.city,
      teaching_head_name: cleanedData.teachingHeadName,
      teaching_head_email: cleanedData.teachingHeadEmail,
      teaching_head_phone: cleanedData.teachingHeadPhone,
      teaching_deputy_name: cleanedData.teachingDeputyName,
      teaching_deputy_email: cleanedData.teachingDeputyEmail,
      teaching_deputy_phone: cleanedData.teachingDeputyPhone,
      for_internship: cleanedData.forInternship,
      for_social_service: cleanedData.forSocialService,
    };
    
    await updateSite(siteId, payload);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name || '',
        institutionId: site.institution_id || '',
        address: site.address || '',
        city: site.city || '',
        teachingHeadName: site.teaching_head_name || '',
        teachingHeadEmail: site.teaching_head_email || '',
        teachingHeadPhone: site.teaching_head_phone || '',
        teachingDeputyName: site.teaching_deputy_name || '',
        teachingDeputyEmail: site.teaching_deputy_email || '',
        teachingDeputyPhone: site.teaching_deputy_phone || '',
        forInternship: site.for_internship ?? true,
        forSocialService: site.for_social_service ?? true,
      });
    }
  }, [site]);

  useEffect(() => {
    if (saved) {
      navigate(adminAbs(ROUTES.ADMIN.SITE_DETAIL(siteId)));
    }
  }, [saved, navigate, siteId]);

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
        title="404"
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
              <dt className="item-header"><label htmlFor="site-edit-name">Nombre de la sede *</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={200}
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-institution-id">Institución *</label></dt>
              <dd className="item-text">
                <select
                  id="site-edit-institution-id"
                  name="institutionId"
                  value={formData.institutionId}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={fetchingInstitutions || saving || Boolean(institutionsError)}
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

            <SiteProgramsField
              forInternship={formData.forInternship}
              forSocialService={formData.forSocialService}
              onChange={handleChange}
              disabled={saving}
            />

            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-address">Dirección *</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={255}
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-city">Municipio *</label></dt>
              <dd className="item-text">
                <select
                  id="site-edit-city"
                  name="city"
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
              <dt className="item-header"><label htmlFor="site-edit-teaching-head-name">Jefe de enseñanza *</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-teaching-head-name"
                  name="teachingHeadName"
                  type="text"
                  value={formData.teachingHeadName}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={100}
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-teaching-head-email">Jefe de enseñanza (correo)</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-teaching-head-email"
                  name="teachingHeadEmail"
                  type="text"
                  value={formData.teachingHeadEmail}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={50}
                  disabled={saving}
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-teaching-head-phone">Jefe de enseñanza (teléfono)</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-teaching-head-phone"
                  name="teachingHeadPhone"
                  type="text"
                  value={formData.teachingHeadPhone}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={15}
                  disabled={saving}
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-teaching-deputy-name">Subjefe de enseñanza</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-teaching-deputy-name"
                  name="teachingDeputyName"
                  type="text"
                  value={formData.teachingDeputyName}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={100}
                  disabled={saving}
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-teaching-deputy-email">Subjefe de enseñanza (correo)</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-teaching-deputy-email"
                  name="teachingDeputyEmail"
                  type="text"
                  value={formData.teachingDeputyEmail}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={50}
                  disabled={saving}
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="site-edit-teaching-deputy-phone">Subjefe de enseñanza (teléfono)</label></dt>
              <dd className="item-text">
                <input
                  id="site-edit-teaching-deputy-phone"
                  name="teachingDeputyPhone"
                  type="text"
                  value={formData.teachingDeputyPhone}
                  onChange={handleChange}
                  className="form-input--half"
                  maxLength={15}
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
