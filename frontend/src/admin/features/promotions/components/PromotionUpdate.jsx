import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdatePromotion from '../hooks/useUpdatePromotion';
import SeatsTable from './SeatsTable';
import { PROGRAM_LABELS, labelOf } from '../../../../utils/constants';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import { USUAL_START_HINT, datesLabel, isISODate, oneYearAfter } from '../promotionDates';

const EMPTY_FORM = { startDate: '', endDate: '', isFinished: false };

function PromotionUpdate({ promotion, fetching, fetchError, refetch, promotionId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePromotion, loading: saving, error: saveError, success: saved, reset } = useUpdatePromotion();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [endEdited, setEndEdited] = useState(false);
  const [validationError, setValidationError] = useState('');
  const justCreated = Boolean(location.state?.created);

  useEffect(() => {
    if (promotion) {
      setFormData({
        startDate: promotion.start_date ?? '',
        endDate: promotion.end_date ?? '',
        isFinished: promotion.is_finished ?? false,
      });
      setEndEdited(false);
    }
  }, [promotion]);

  // Tras guardar se queda en la página (los cupos se editan aquí mismo) y se recarga la promoción.
  useEffect(() => {
    if (!saved) return undefined;
    refetch();
    const timeout = setTimeout(reset, 6000);
    return () => clearTimeout(timeout);
  }, [saved, refetch, reset]);

  const clearErrors = () => {
    if (validationError) setValidationError('');
    if (saveError || saved) reset();
  };

  const handleStart = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      startDate: value,
      endDate: !endEdited && isISODate(value) ? oneYearAfter(value) : prev.endDate,
    }));
    clearErrors();
  };

  const handleEnd = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, endDate: value }));
    setEndEdited(true);
    clearErrors();
  };

  const handleFinished = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, isFinished: checked }));
    clearErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    if (!isISODate(formData.startDate)) errors.push('La fecha de inicio es obligatoria.');
    if (!isISODate(formData.endDate)) errors.push('La fecha de término es obligatoria.');
    else if (isISODate(formData.startDate) && formData.endDate <= formData.startDate) {
      errors.push('La fecha de término debe ser posterior a la de inicio.');
    }
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }
    await updatePromotion(promotionId, {
      start_date: formData.startDate,
      end_date: formData.endDate,
      is_finished: formData.isFinished,
    });
  };

  if (fetching && !promotion) return <LoadingSpinner />;

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
        retryLabel="Recargar"
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  // La tabla de cupos queda FUERA del <form> de la promoción: tiene su propio guardado.
  return (
    <div className="component-container">
      {justCreated && !saved && (
        <div className="alert-success">Promoción registrada. Ahora captura los cupos por sede y guárdalos.</div>
      )}
      <form onSubmit={handleSubmit}>
        {saved && <div className="alert-success">Promoción actualizada.</div>}
        {(validationError || saveError) && (
          <div className="alert-error">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{validationError || saveError}</span>
          </div>
        )}

        <div className="info-container">
          <div className="item-container">
            <dl className="item-list">
              <div className="item-row">
                <dt className="item-header">Programa</dt>
                <dd className="item-text">{labelOf(PROGRAM_LABELS, promotion.program)}</dd>
              </div>
              <div className="item-row">
                <dt className="item-header"><label htmlFor="promotion-start">Fecha de inicio *</label></dt>
                <dd className="item-text">
                  <input id="promotion-start" type="date" value={formData.startDate} onChange={handleStart}
                    className="form-input--half" disabled={saving} required />
                  <p className="mt-1 text-xs text-gray-500">{USUAL_START_HINT[promotion.program]}</p>
                </dd>
              </div>
              <div className="item-row">
                <dt className="item-header"><label htmlFor="promotion-end">Fecha de término *</label></dt>
                <dd className="item-text">
                  <input id="promotion-end" type="date" value={formData.endDate} min={formData.startDate || undefined}
                    onChange={handleEnd} className="form-input--half" disabled={saving} required />
                </dd>
              </div>
              <div className="item-row">
                <dt className="item-header">Promoción</dt>
                <dd className="item-text font-medium">{datesLabel(formData.startDate, formData.endDate) || '—'}</dd>
              </div>
              <div className="item-row">
                <dt className="item-header"><label htmlFor="promotion-finished">¿Promoción finalizada?</label></dt>
                <dd className="item-text">
                  <input id="promotion-finished" className="form-checkbox" type="checkbox" checked={formData.isFinished}
                    onChange={handleFinished} disabled={saving} />
                  <p className="mt-1 text-xs text-gray-500">Al finalizarla, los alumnos ya no pueden cambiar sus documentos.</p>
                </dd>
              </div>
            </dl>
          </div>

          <div className="button-group">
            <button type="button" className="btn-secondary" onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(promotionId)))} disabled={saving}>
              Volver
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar promoción'}
            </button>
          </div>
        </div>
      </form>

      <section className="mt-16 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cupos por sede</h3>
          <p className="text-sm text-gray-500">Captura los cupos de todas las sedes y guárdalos juntos.</p>
        </div>
        <SeatsTable promotion={promotion} />
      </section>
    </div>
  );
}

export default PromotionUpdate;
