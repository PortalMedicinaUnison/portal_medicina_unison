import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreatePromotion from '../hooks/useCreatePromotion';
import { cleanFormData } from "../../../../utils/utils";
import { PERIOD_LABELS, PROGRAMS, PROGRAM_LABELS } from '../../../../utils/constants';


const INITIAL_FORM = {
  program: String(PROGRAMS.INTERNSHIP),
  year: '',
  period: '',
  isFinished: false,
};

function PromotionForm() {
  const navigate = useNavigate();
  const { createPromotion, loading: saving, success: saved, error: saveError, reset } = useCreatePromotion();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [createdId, setCreatedId] = useState(null);
  const [validationError, setValidationError] = useState('');

  // El backend exige al crear: año actual <= año <= año actual + 5.
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 5;

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

    const cleanedData = cleanFormData({
      program: Number(formData.program),
      year: Number(formData.year),
      period: Number(formData.period),
      isFinished: formData.isFinished,
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.year) errors.push('El año es obligatorio.');
    else if (cleanedData.year < currentYear) errors.push(`El año debe ser mayor o igual a ${currentYear}.`);
    else if (cleanedData.year > maxYear) errors.push(`El año no puede ser mayor a ${maxYear}.`);
    if (cleanedData.period !== 1 && cleanedData.period !== 2) errors.push('Selecciona un periodo válido.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      program: cleanedData.program,
      year: cleanedData.year,
      period: cleanedData.period,
      is_finished: cleanedData.isFinished,
    };
    
    const response = await createPromotion(payload);
    if (response && response.data.promotion_id) {
      setCreatedId(response.data.promotion_id);
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
          Promoción registrada exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(createdId))}
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
              <dt className="item-header">Programa</dt>
              <dd className="item-text">
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={saving}
                  required
                >
                  {Object.entries(PROGRAM_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Año</dt>
              <dd className="item-text">
                <input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder={String(currentYear)}
                  min={currentYear}
                  max={maxYear}
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
                  <option value="">Seleccionar periodo</option>
                  {Object.entries(PERIOD_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </dd>
            </div>
            <div className="item-row mt-6">
              <dd className="item-text">Para añadir una sede, primero crea la promoción y luego dirígete a editar esa promoción</dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
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

export default PromotionForm;