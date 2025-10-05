import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdatePromotion from '../hooks/useUpdatePromotion';
import PsdList from '../promotionDetailSite/components/PsdList';
import PsdForm from '../promotionDetailSite/components/PsdForm';
import { cleanFormData } from "../../../../utils/utils";
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';


const INITIAL_FORM = {
  year: '',
  period: 0,
  isFinished: false,
};

function PromotionUpdate({ promotion, fetching, fetchError, refetch, promotionId }) {
  const navigate = useNavigate();
  const { updatePromotion, loading: saving, error: saveError, success: saved, reset } = useUpdatePromotion();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  const [openModal, setOpenModal] = useState(false);

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

    if (!promotionId) {
        setValidationError('ID de anuncio no proporcionado.');
        return;
    }

    const cleanedData = cleanFormData({
      year: Number(formData.year),
      period: Number(formData.period),
      isFinished: formData.isFinished,
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.year) errors.push('El año es obligatorio');
    if (cleanedData.year < 2025) errors.push('El año debe ser mayor o igual a 2025');
    if (!cleanedData.period) errors.push('El periodo es obligatorio');
    if (cleanedData.period < 1 || cleanedData.period > 2) errors.push('El periodo debe ser 1 o 2');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      year: cleanedData.year,
      period: cleanedData.period,
      is_finished: cleanedData.isFinished,
    };    
    
    await updatePromotion(promotionId, payload);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (promotion) {
      setFormData({
        year: promotion.year || '',
        period: promotion.period || '',
        isFinished: promotion.is_finished || false,
      });
    }
  }, [promotion]);

  useEffect(() => {
    if (saved) {
      navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(promotionId)));
    }
  }, [saved, navigate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (fetching) return <LoadingSpinner/>;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información"
        message="Intenta recargar o vuelve a la lista."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }
  
  if (!promotion) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información para esta promoción."
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
              <dt className="item-header">Año</dt>
              <dd className="item-text">
                <input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input--half"
                  min={2025}
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Periodo</dt>
              <dd className="item-text">
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={saving}
                  required
                >
                  <option value={0}>Seleccionar periodo</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">¿Promoción finalizada?</dt>
              <dd className="item-text">
                <input
                  className="form-checkbox"
                  name="isFinished"
                  type="checkbox"
                  checked={formData.isFinished}
                  onChange={handleChange}
                  disabled={saving}
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-16"> 
          <PsdList promotionId={Number(promotionId)}/>
        </div>

        <Modal
          open={openModal}
          title="Añadir cupos a una sede"
          onClose={() => setOpenModal(false)}
        >
          <PsdForm 
            promotionId={promotionId}
            onClose={() => setOpenModal(false)}
            onSuccess={() => setOpenModal(false)} 
          />
        </Modal>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-tertiary"
            onClick={() => setOpenModal(true)}

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
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PromotionUpdate;