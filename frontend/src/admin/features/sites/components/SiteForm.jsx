import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateSite from "../hooks/useCreateSite";
import useGetInstitutions from "../hooks/useGetInstitutions";
import { ROUTES, adminAbs } from "../../../../config";
import { SONORA_MUNICIPALITIES } from "../../../../utils/constants.js";
import { isValidCity } from "../../../../utils/validations.js";

function SiteForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

  const { createSite, error, success } = useCreateSite();
  const { institutions, loading: institutionsLoading, error: institutionsError } = useGetInstitutions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidCity(formData.city)) {
      alert('El municipio seleccionado no es válido');
      return;
    }

    if (!formData.institutionId) {
      alert('Por favor selecciona una institución');
      return;
    }

    const isCreated = await createSite(formData);
    if (isCreated) {
      console.log('Sede registrada exitosamente');
      
      setFormData({
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
      });
    }
  };

  return (
    <form className="component-container" onSubmit={handleSubmit}>

      {success && (
        <div className="alert-success-text">
          Sede registrada exitosamente.
        </div>
      )}

      {error && (
        <div className="alert-footer-text">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="info-container">
        
        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">Razon social</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Razon social"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Institución</dt>
              <dd className="item-text">
                <select
                  className="form-input--half"
                  name="institutionId"
                  value={formData.institutionId}
                  onChange={handleChange}
                  required
                  disabled={institutionsLoading}
                >
                  <option value="">
                    {institutionsLoading ? 'Cargando instituciones...' : 'Seleccionar institución'}
                  </option>
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
                  className="form-input--half"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Direccion"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Ciudad</dt>
              <dd className="item-text">
                <select
                  className="form-input--half"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
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
                  className="form-input--half"
                  name="teachingHeadName"
                  type="text"
                  value={formData.teachingHeadName}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Jefe de enseñanza (email)</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teachingHeadEmail"
                  type="email"
                  value={formData.teachingHeadEmail}
                  onChange={handleChange}
                  placeholder="email@dominio.com"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Jefe de enseñanza (teléfono)</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teachingHeadPhone"
                  type="tel"
                  value={formData.teachingHeadPhone}
                  onChange={handleChange}
                  placeholder="Teléfono"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Subjefe de enseñanza</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teachingDeputyName"
                  type="text"
                  value={formData.teachingDeputyName}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Subjefe de enseñanza (email)</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teachingDeputyEmail"
                  type="email"
                  value={formData.teachingDeputyEmail}
                  onChange={handleChange}
                  placeholder="email@dominio.com"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Subjefe de enseñanza (teléfono)</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teachingDeputyPhone"
                  type="tel"
                  value={formData.teachingDeputyPhone}
                  onChange={handleChange}
                  placeholder="Teléfono"
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
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
}

export default SiteForm;
