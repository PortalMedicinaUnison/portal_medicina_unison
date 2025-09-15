import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreatePromotion from "../hooks/useCreatePromotion.js";
import { ROUTES, adminAbs } from "../../../../config.js";

function PromotionForm() {
  const navigate = useNavigate();
  const { createPromotion, error, success } = useCreatePromotion();

  const [formData, setFormData] = useState({
    year: 2025,
    period: '',
    is_finished: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isCreated = await createPromotion(formData);
    if (isCreated) {
      console.log('Promoción registrada exitosamente');
      
      setFormData({
        year: 2025,
        period: '',
        is_finished: '',
      });
    }
  };

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {success && (
        <div className="alert-success-text">
          Promoción registrada exitosamente.
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
              <dt className="item-header">Año</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Año"
                  min={2025}
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Periodo</dt>
              <dd className="item-text">
                <select
                  className="form-input--half"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar periodo</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </dd>
            </div>
          </dl>
        </div>

        <div className="item-row">
              <dd className="item-text">Para añadir una sede, primero crea la promoción y luego dirigete a editar esa promoción</dd>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_LIST))}
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

export default PromotionForm;
