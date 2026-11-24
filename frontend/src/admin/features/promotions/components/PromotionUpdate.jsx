import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useUpdatePromotion from '../hooks/useUpdatePromotion';
import useSeatsEditor from '../hooks/useSeatsEditor';
import SeatsTable from './SeatsTable';
import { PROGRAM_LABELS, labelOf } from '../../../../utils/constants';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import Modal from '../../../../utils/ui/Modal';
import ConfirmDialogContent from '../../../../utils/ui/ConfirmDialogContent';
import { USUAL_START_HINT, datesLabel, isISODate, oneYearAfter } from '../promotionDates';

const EMPTY_FORM = { startDate: '', endDate: '', isFinished: false };

/**
 * Edición de la promoción: datos generales y cupos por sede con un solo "Guardar". Lo que cambió
 * viaja en una sola petición (los cupos en `seats`) y el backend lo guarda todo o nada.
 */
function PromotionUpdate({ promotion, fetching, fetchError, refetch, promotionId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePromotion, loading: saving, error: saveError, reset } = useUpdatePromotion();
  const seats = useSeatsEditor(promotion);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [endEdited, setEndEdited] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const justCreated = Boolean(location.state?.created);

  const original = useMemo(() => ({
    startDate: promotion?.start_date ?? '',
    endDate: promotion?.end_date ?? '',
    isFinished: promotion?.is_finished ?? false,
  }), [promotion]);

  // Al cargar (y tras guardar) el formulario toma lo registrado.
  useEffect(() => {
    if (!promotion) return;
    setFormData(original);
    setEndEdited(false);
  }, [promotion, original]);

  const datesChanged = formData.startDate !== original.startDate || formData.endDate !== original.endDate;
  const finishedChanged = formData.isFinished !== original.isFinished;
  const seatsChanged = seats.changed.length;
  const dirty = datesChanged || finishedChanged || seatsChanged > 0;
  const pending = [
    datesChanged && 'fechas',
    finishedChanged && 'estatus',
    seatsChanged > 0 && `${seatsChanged} ${seatsChanged === 1 ? 'cupo' : 'cupos'}`,
  ].filter(Boolean);

  const touch = () => {
    if (validationError) setValidationError('');
    if (saveError) reset();
    setSaved(false);
  };

  const handleStart = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      startDate: value,
      endDate: !endEdited && isISODate(value) ? oneYearAfter(value) : prev.endDate,
    }));
    touch();
  };

  const handleEnd = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, endDate: value }));
    setEndEdited(true);
    touch();
  };

  const handleFinished = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, isFinished: checked }));
    touch();
  };

  const handleSave = async ({ confirmed = false } = {}) => {
    const errors = [];
    if (!isISODate(formData.startDate)) errors.push('La fecha de inicio es obligatoria.');
    if (!isISODate(formData.endDate)) errors.push('La fecha de término es obligatoria.');
    else if (isISODate(formData.startDate) && formData.endDate <= formData.startDate) {
      errors.push('La fecha de término debe ser posterior a la de inicio.');
    }
    if (seats.invalid.length > 0) errors.push('Revisa los cupos marcados en rojo.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }
    if (finishedChanged && formData.isFinished && !confirmed) {
      setConfirmFinish(true);
      return;
    }

    const payload = {};
    if (datesChanged) Object.assign(payload, { start_date: formData.startDate, end_date: formData.endDate });
    if (finishedChanged) payload.is_finished = formData.isFinished;
    if (seatsChanged > 0) payload.seats = seats.seatsPayload();
    if (await updatePromotion(promotionId, payload)) {
      await Promise.all([refetch(), seats.afterSave()]);
      setSaved(true);
      setSavedCount((n) => n + 1);
    }
  };

  const handleDiscard = () => {
    setFormData(original);
    setEndEdited(false);
    seats.discard();
    touch();
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

  return (
    <div className="component-container">
      {justCreated && !saved && !dirty && (
        <div className="alert-success">Promoción registrada. Ahora captura los cupos por sede y guarda.</div>
      )}

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Datos generales</h3>
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
      </section>

      <section className="mt-12 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cupos por sede</h3>
          <p className="text-sm text-gray-500">Captura los cupos de todas las sedes del programa.</p>
        </div>
        <SeatsTable editor={seats} promotion={promotion} busy={saving} savedCount={savedCount} />
      </section>

      <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6">
        {(validationError || saveError) && (
          <div className="alert-error">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{validationError || saveError}</span>
          </div>
        )}
        {saved && !dirty && <div className="alert-success">Cambios guardados.</div>}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="mr-auto text-sm text-gray-500" aria-live="polite">
            {pending.length > 0 ? `Cambios sin guardar: ${pending.join(', ')}.` : 'Sin cambios por guardar.'}
          </p>
          <button type="button" className="btn-secondary" onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_DETAIL(promotionId)))} disabled={saving}>
            Volver
          </button>
          {dirty && (
            <button type="button" className="btn-secondary" onClick={handleDiscard} disabled={saving}>Descartar cambios</button>
          )}
          <button type="button" className="btn-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => handleSave()}
            disabled={!dirty || saving || seats.loading}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <Modal open={confirmFinish} onClose={() => setConfirmFinish(false)}>
        <ConfirmDialogContent
          title="Finalizar la promoción"
          message="Al finalizarla, los alumnos de esta promoción ya no podrán subir ni cambiar sus documentos. ¿Guardar la promoción como finalizada?"
          onConfirm={() => { setConfirmFinish(false); handleSave({ confirmed: true }); }}
          onCancel={() => setConfirmFinish(false)}
          primaryLabel="Finalizar promoción"
          secondaryLabel="Cancelar"
        />
      </Modal>
    </div>
  );
}

export default PromotionUpdate;
