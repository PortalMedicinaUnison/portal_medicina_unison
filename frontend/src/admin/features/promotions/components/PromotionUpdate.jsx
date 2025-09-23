import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import usePromotion from "../hooks/usePromotion";
import usePromotionUpdate from "../hooks/useUpdatePromotion";
import PsdList from '../promotionDetailSite/components/PsdList';

import PsdForm from '../promotionDetailSite/components/PsdForm'
import Modal from '../../../../utils/ui/Modal'

function PromotionUpdate() {
  const navigate = useNavigate();
  const { promotionId } = useParams();

  const { promotion, loading: loadingPromotion, error: loadError } = usePromotion(promotionId);
  const { updatePromotion, error: updateError, success, saving } = usePromotionUpdate();

  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    year: 2025,
    period: "",
    is_finished: false,
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        year: Number(promotion.year) || 2025,
        period: String(promotion.period ?? ""),
        is_finished: Boolean(promotion.is_finished),
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!formData.year || Number(formData.year) < 2025) {
      setLocalError("Ingresa un año válido (≥ 2025).");
      return false;
    }
    if (!String(formData.period).trim()) {
      setLocalError("Selecciona un periodo.");
      return false;
    }
    setLocalError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!promotionId) {
      setLocalError("No se puede actualizar: falta el ID de la promoción.");
      return;
    }
    if (!validate()) return;

    await updatePromotion(formData, promotionId);
  };

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {success && (
        <div className="alert-success-text">Promoción actualizada exitosamente.</div>
      )}

      {(localError || loadError || updateError) && (
        <div className="alert-footer-text">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{localError || loadError || updateError}</span>
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
                  min={2025}
                  disabled={loadingPromotion || saving}
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
                  disabled={loadingPromotion || saving}
                >
                  <option value="">Seleccionar periodo</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">¿Promoción finalizada?</dt>
              <dd className="item-text">
                <input
                  className="form-checkbox"
                  name="is_finished"
                  type="checkbox"
                  checked={formData.is_finished}
                  onChange={handleChange}
                  disabled={loadingPromotion || saving}
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-16"> 
          <PsdList />
        </div>

        <Modal
          open={open}
          title="Añadir cupos a una sede"
          onClose={() => setOpen(false)}
        >
          <PsdForm 
            onClose={() => setOpen(false)}
            onSuccess={() => setOpen(false)} 
          />
        </Modal>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-tertiary"
            onClick={() => setOpen(true)}

          >
            Añadir sede
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_LIST))}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loadingPromotion || saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PromotionUpdate;
