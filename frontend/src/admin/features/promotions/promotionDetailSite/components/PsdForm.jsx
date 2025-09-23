import { useState } from "react";
import { useParams } from "react-router-dom";
import usePromotion from "../../hooks/usePromotion";
import useCreatePsd from "../hooks/useCreatePsd";
import useGetSites from "../hooks/useGetSites"

function PsdForm({ onClose, onSuccess }){  
  const {createPsd, error, success} = useCreatePsd();
  const { promotionId } = useParams();
  const { promotion } = usePromotion(promotionId);
  const { sites, loading: sitesLoading, error: sitesError } = useGetSites();
  const [formData, setFormData] = useState({
    siteId: "",
    capacity: "",
  });

  const isValid = formData.siteId !== "" && Number(formData.capacity) > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const data = {
      promotion_id: promotionId ?? promotion?.promotion_id,
      site_id: formData.siteId,
      capacity: formData.capacity,
    };

    const isCreated = await createPsd(data);
    if (isCreated) {
      console.log('Sede añadida exitosamente');
      
      setFormData({
        siteId: '',
        capacity: '',
      });

      onSuccess?.();
    }
  };

  return (
      <div>
        {success && (
          <div className="alert-success-text">
            Sede añadida exitosamente.
          </div>
        )}

        {error && (
          <div className="alert-footer-text">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <dl className="item-list">
          <div className="item-row">
            <dt className="item-header">Sede</dt>
            <dd className="item-text">
            <select
              id="siteId"
              name="siteId"
              className="form-input w-full"
              value={formData.siteId}
              onChange={handleChange}
              required
              disabled={sitesLoading}
            >
              <option value="">
                {sitesLoading ? 'Cargando sedes...' : 'Seleccionar sede'}
              </option>
              {sites.map(site => (
                <option key={site.site_id} value={site.site_id}>
                  {site.name}
                </option>
              ))}
            </select>
          </dd>
        </div>

          <div className="item-row">
            <dt className="item-header">Numero de cupos</dt>
            <dd className="item-text">
              <input
                className="form-input--half w-full"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="1"
                required
              />
            </dd>
          </div>
        </dl>

          <div className="button-group">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="button"
              className="btn-primary disabled:opacity-50"
              disabled={!isValid}
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
      </div>
  );
}

export default PsdForm;