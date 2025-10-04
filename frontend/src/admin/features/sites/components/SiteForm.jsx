import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateSite from "../hooks/useCreateSite";
import useGetInstitutions from "../../institutions/hooks/useGetInstitutions.js";
import { cleanFormData } from "../../../../utils/utils";
import { SONORA_MUNICIPALITIES } from "../../../../utils/constants.js";


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

function SiteForm() {
  const navigate = useNavigate();
  const { createSite, loading: saving, success: saved, error: saveError, reset } = useCreateSite();
  const { institutions, loading: fetchingInstitutions, error: institutionsError } = useGetInstitutions();

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

    if (validationError) setValidationError('');
    if (saveError) return reset();
            
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = cleanFormData({
      ...formData,
      institutionId: Number(formData.institutionId),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.name) errors.push('La razon social es requerida');
    if (!cleanedData.institutionId) errors.push('La institución es requerida');
    if (!cleanedData.address) errors.push('La dirección es requerida');
    if (!cleanedData.city) errors.push('La ciudad es requerida');
    if (!cleanedData.teachingHeadName) errors.push('El nombre del jefe de enseñanza es requerido');
    if (!cleanedData.teachingDeputyName) errors.push('El nombre del subjefe de enseñanza es requerido');
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
    };
    
    const response = await createSite(payload);
    if (response && response.data.site_id) {
      setCreatedId(response.data.site_id);
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

// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {saved && (
        <div className="alert-success">
          Sede registrada exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.SITE_DETAIL(createdId))}
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
              <dt className="item-header">Razon social *</dt>
              <dd className="item-text">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Hospital General Zona 2"
                  maxLength={200}
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Institución *</dt>
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
              <dt className="item-header">Dirección *</dt>
              <dd className="item-text">
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="C. Benito Juárez 206, Modelo, 83190"
                  maxLength={255}
                  disabled={saving}
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Ciudad *</dt>
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
              <dt className="item-header">Jefe de enseñanza *</dt>
              <dd className="item-text">
                <input
                  name="teachingHeadName"
                  type="text"
                  value={formData.teachingHeadName}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Dr. Juan Pérez"
                  maxLength={100}
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
                  className="form-input--half"
                  placeholder="juan.perez@imss.mx"
                  maxLength={50}
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
                  className="form-input--half"
                  placeholder="6621234567"
                  maxLength={15}
                  disabled={saving}
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Subjefe de enseñanza *</dt>
              <dd className="item-text">
                <input
                  name="teachingDeputyName"
                  type="text"
                  value={formData.teachingDeputyName}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Dra. María López"
                  maxLength={100}
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
                  className="form-input--half"
                  placeholder="maria.lopez@unison.mx"
                  maxLength={50}
                  disabled={saving}
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
                  className="form-input--half"
                  placeholder="+526621234567"
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

export default SiteForm;
