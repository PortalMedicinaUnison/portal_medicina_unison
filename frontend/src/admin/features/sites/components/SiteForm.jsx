import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateSite from "../hooks/useCreateSite";
import { ROUTES } from "../../../../config";

function SiteForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    capacity: '',
    teachingHeadName: '',
    teachingHeadEmail: '',
    teachingHeadPhone: '',
    teachingDeputyName: '',
    teachingDeputyEmail: '',
    teachingDeputyPhone: '',
    isAvailable: true,
  });

  const { createSite, error, success } = useCreateSite();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCreated = await createSite(formData);
    if (isCreated) {
      console.log('Sede registrada exitosamente');
      
      setFormData({
        name: '',
        address: '',
        city: '',
        capacity: '',
        teachingHeadName: '',
        teachingHeadEmail: '',
        teachingHeadPhone: '',
        teachingDeputyName: '',
        teachingDeputyEmail: '',
        teachingDeputyPhone: '',
        isAvailable: true,
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
                <input
                  className="form-input--half"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Capacidad</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Capacidad"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Jefe de enseñanza</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teaching_head_name"
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
                  name="teaching_head_email"
                  type="email"
                  value={formData.teachingHeadEmail}
                  onChange={handleChange}
                  placeholder="email@dominio"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Jefe de enseñanza (teléfono)</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teaching_head_phone"
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
                  name="teaching_head_name"
                  type="text"
                  value={formData.teachingHeadName}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Subjefe de enseñanza (email)</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teaching_head_email"
                  type="email"
                  value={formData.teachingHeadEmail}
                  onChange={handleChange}
                  placeholder="email@dominio"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Subjefe de enseñanza (teléfono)</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="teaching_head_phone"
                  type="tel"
                  value={formData.teachingHeadPhone}
                  onChange={handleChange}
                  placeholder="Teléfono"
                />
              </dd>
            </div>


            <div className="item-row">
              <dt className="item-header">¿Esta disponible?</dt>
              <dd className="item-text">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  <span>Sí</span>
                </label>
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(ROUTES.ADMIN.SITE_LIST)}
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
