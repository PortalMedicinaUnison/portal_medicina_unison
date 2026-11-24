import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdatePromotion from '../hooks/useUpdatePromotion';
import useGetPsdsByProm from '../promotionDetailSite/hooks/useGetPsdsByProm';
import PsdList from '../promotionDetailSite/components/PsdList';
import { cleanFormData } from "../../../../utils/utils";
import { PERIOD_LABELS } from '../../../../utils/constants';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';


const INITIAL_FORM = {
  year: '',
  period: '',
  isFinished: false,
};

// Rango que acepta el backend al editar (utils/validation.py: validate_year).
// Al editar no se exige el año actual, para poder actualizar promociones de años anteriores.
const MIN_YEAR = 2000;

function PromotionUpdate({ promotion, fetching, fetchError, refetch, promotionId }) {
  const navigate = useNavigate();
  const { updatePromotion, loading: saving, error: saveError, success: saved, reset } = useUpdatePromotion();
  const { psds, loading: psdsFetching, error: psdsError, refetch: refetchPsds } = useGetPsdsByProm(promotionId);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

  const maxYear = new Date().getFullYear() + 5;

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
        setValidationError('ID de promoción no proporcionado.');
        return;
    }

    const cleanedData = cleanFormData({
      year: Number(formData.year),
      period: Number(formData.period),
      isFinished: formData.isFinished,
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.year) errors.push('El año es obligatorio.');
    else if (cleanedData.year < MIN_YEAR || cleanedData.year > maxYear) errors.push(`El año debe estar entre ${MIN_YEAR} y ${maxYear}.`);
    if (cleanedData.period !== 1 && cleanedData.period !== 2) errors.push('Selecciona un periodo válido.');
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
        year: promotion.year ?? '',
        period: promotion.period ?? '',
        isFinished: promotion.is_finished ?? false,
      });
    }
  }, [promotion]);

  useEffect(() => {
    if (saved) {
      navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(promotionId)));
    }
  }, [saved, navigate, promotionId]);

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

  // La gestión de cupos queda FUERA del <form> de la promoción: los eventos de React se propagan
  // a través de los portales (Modal), así que un submit del formulario de cupos o un Enter en el
  // buscador de sedes dispararían también el guardado de la promoción.
  return (
    <div className="component-container">
      <form onSubmit={handleSubmit}>
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
                    min={MIN_YEAR}
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

      <section className="mt-16 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cupos por sede</h3>
          <p className="text-sm text-gray-500">Los cambios en los cupos se guardan al momento.</p>
        </div>
        <PsdList
          psds={psds}
          fetching={psdsFetching}
          fetchError={psdsError}
          refetch={refetchPsds}
          promotionId={promotionId}
        />
      </section>
    </div>
  );
}

export default PromotionUpdate;
