import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreatePromotion from '../hooks/useCreatePromotion';
import useGetPromotions from '../hooks/useGetPromotions';
import { PROGRAMS, PROGRAM_LABELS } from '../../../../utils/constants';
import { promotionLabel } from '../../../../utils/utils';
import { USUAL_START_HINT, datesLabel, isISODate, nextUsualStart, oneYearAfter, semesterTaken } from '../promotionDates';
import { promotionListPath } from '../promotionPaths';
import { programFromParams } from '../../../../utils/programParams';

const MAX_YEARS_AHEAD = 5;  // como el backend

/**
 * Alta de promoción: basta la fecha de inicio (se propone el próximo inicio habitual libre del
 * programa) y el término se calcula a doce meses. Al guardar se pasa a capturar los cupos.
 */
function PromotionForm() {
  const navigate = useNavigate();
  const { createPromotion, loading: saving, error: saveError, reset } = useCreatePromotion();
  const [searchParams] = useSearchParams();
  const [program, setProgram] = useState(() => programFromParams(searchParams) ?? PROGRAMS.INTERNSHIP);
  const { promotions, loading: loadingPromotions } = useGetPromotions({ program });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startEdited, setStartEdited] = useState(false);
  const [endEdited, setEndEdited] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Propuesta inicial (y al cambiar de programa): el próximo inicio habitual sin promoción.
  useEffect(() => {
    if (loadingPromotions || startEdited) return;
    const start = nextUsualStart(program, promotions);
    setStartDate(start);
    setEndDate(start ? oneYearAfter(start) : '');
    setEndEdited(false);
  }, [program, promotions, loadingPromotions, startEdited]);

  const clearErrors = () => {
    if (validationError) setValidationError('');
    if (saveError) reset();
  };

  const handleProgram = (e) => {
    setProgram(Number(e.target.value));
    setStartEdited(false);
    clearErrors();
  };

  const handleStart = (e) => {
    const { value } = e.target;
    setStartDate(value);
    setStartEdited(true);
    if (!endEdited && isISODate(value)) setEndDate(oneYearAfter(value));
    clearErrors();
  };

  const handleEnd = (e) => {
    setEndDate(e.target.value);
    setEndEdited(true);
    clearErrors();
  };

  const taken = semesterTaken(startDate, promotions);
  const label = datesLabel(startDate, endDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const thisYear = new Date().getFullYear();
    const errors = [];
    if (!isISODate(startDate)) errors.push('La fecha de inicio es obligatoria.');
    else if (Number(startDate.slice(0, 4)) < thisYear) errors.push('La promoción no puede empezar antes del año actual.');
    else if (Number(startDate.slice(0, 4)) > thisYear + MAX_YEARS_AHEAD) errors.push('La fecha de inicio no es válida.');
    if (!isISODate(endDate)) errors.push('La fecha de término es obligatoria.');
    else if (isISODate(startDate) && endDate <= startDate) errors.push('La fecha de término debe ser posterior a la de inicio.');
    if (taken) errors.push(`Ya existe la promoción ${promotionLabel(taken)}: solo puede haber una que inicie en cada semestre.`);
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const response = await createPromotion({ program, start_date: startDate, end_date: endDate });
    const createdId = response?.data?.promotion_id;
    if (createdId) navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(createdId)), { state: { created: true } });
  };

  return (
    <form className="component-container" onSubmit={handleSubmit}>
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
              <dt className="item-header"><label htmlFor="promotion-program">Programa</label></dt>
              <dd className="item-text">
                <select id="promotion-program" value={program} onChange={handleProgram} className="form-input--half" disabled={saving}>
                  {Object.entries(PROGRAM_LABELS).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                </select>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="promotion-start">Fecha de inicio *</label></dt>
              <dd className="item-text">
                <input id="promotion-start" type="date" value={startDate} onChange={handleStart}
                  className="form-input--half" disabled={saving || loadingPromotions} required />
                <p className="mt-1 text-xs text-gray-500">{USUAL_START_HINT[program]}</p>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="promotion-end">Fecha de término *</label></dt>
              <dd className="item-text">
                <input id="promotion-end" type="date" value={endDate} min={startDate || undefined} onChange={handleEnd}
                  className="form-input--half" disabled={saving || loadingPromotions} required />
                <p className="mt-1 text-xs text-gray-500">Se propone a doce meses del inicio; cámbiala si la promoción dura otro tiempo.</p>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Promoción</dt>
              <dd className="item-text">
                <span className="font-medium">{label || '—'}</span>
                {taken && (
                  <span className="mt-1 block text-xs text-red-700">
                    Ya existe la promoción {promotionLabel(taken)}; elige una fecha de otro semestre.
                  </span>
                )}
              </dd>
            </div>
            <div className="item-row mt-6">
              <dd className="item-text text-gray-600">Al guardar podrás capturar los cupos por sede.</dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button type="button" className="btn-secondary" onClick={() => navigate(promotionListPath(program))} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={saving || loadingPromotions}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PromotionForm;
