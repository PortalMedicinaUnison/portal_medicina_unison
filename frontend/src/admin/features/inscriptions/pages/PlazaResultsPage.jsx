import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import { getPsdsByPromotionIdRequest } from '../../../../services/promotionService';
import { recordPlazaResultsRequest } from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';
import { formatFullName, normalizeText, promotionLabel } from '../../../../utils/utils';
import { INSCRIPTION_PROGRAMS, formatAverage } from '../programs';
import usePromotionPicker from '../hooks/usePromotionPicker';
import useInscriptions from '../hooks/useInscriptions';
import DocumentsStatus from '../components/DocumentsStatus';

// En el acto eligen quienes ya aceptaron y tienen el programa en curso (activo o suspendido).
const IN_COURSE = new Set([1, 2]);
const byActOrder = (a, b) => {
  const avg = (x) => (x.average == null ? -1 : Number(x.average));
  return (avg(b) - avg(a))
    || normalizeText(`${a.student?.last_name} ${a.student?.first_name}`).localeCompare(normalizeText(`${b.student?.last_name} ${b.student?.first_name}`));
};

/**
 * Resultados del acto público: la coordinación registra de una vez la sede o plaza que eligió
 * cada estudiante, en orden de promedio. El cupo restante se recalcula mientras se captura y el
 * backend aplica las mismas reglas que una por una (cupo y documentos de inscripción aprobados).
 */
function PlazaResultsPage({ program }) {
  const config = INSCRIPTION_PROGRAMS[program];
  const { promotions, promotion, promotionId, selectPromotion, loading: loadingPromotions, error: promotionsError } = usePromotionPicker(program);
  const { inscriptions, loading, error, reload } = useInscriptions(program, promotionId);
  const [psds, setPsds] = useState(null);       // null mientras cargan
  const [psdsError, setPsdsError] = useState(null);
  const [edits, setEdits] = useState({});       // application_id → site_id ('' = sin sede)
  const [results, setResults] = useState({});   // application_id → { ok, detail }
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const loadSeats = useCallback(async () => {
    if (!promotionId) return;
    try {
      const { data } = await getPsdsByPromotionIdRequest(promotionId);
      setPsds([...data].sort((a, b) => (a.site?.name ?? '').localeCompare(b.site?.name ?? '')));
      setPsdsError(null);
    } catch (err) {
      setPsdsError(getErrorMessage(err, 'No se pudieron cargar los cupos.'));
    }
  }, [promotionId]);

  useEffect(() => {
    setEdits({});
    setResults({});
    setPsds(null);
    loadSeats();
  }, [loadSeats]);

  const record = (a) => a[config.recordKey];
  const rows = useMemo(
    () => inscriptions.filter((a) => record(a) && IN_COURSE.has(Number(record(a).status))).sort(byActOrder),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inscriptions],
  );
  const saved = (a) => (record(a)?.site_id != null ? String(record(a).site_id) : '');
  const choice = (a) => edits[a.application_id] ?? saved(a);

  // Cupo restante por sede según lo que se ve en la tabla (incluye lo que aún no se guarda).
  const remaining = useMemo(() => {
    const used = {};
    rows.forEach((a) => {
      const value = edits[a.application_id] ?? saved(a);
      if (value) used[value] = (used[value] ?? 0) + 1;
    });
    return Object.fromEntries((psds ?? []).map((p) => [String(p.site_id), p.capacity - (used[String(p.site_id)] ?? 0)]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, edits, psds]);

  const changed = rows.filter((a) => edits[a.application_id] !== undefined && edits[a.application_id] !== saved(a));

  const handleChange = (application, value) => {
    setEdits((prev) => ({ ...prev, [application.application_id]: value }));
    setResults((prev) => {
      const next = { ...prev };
      delete next[application.application_id];
      return next;
    });
  };

  const handleSave = async () => {
    if (changed.length === 0) return;
    setSaving(true);
    setSaveError(null);
    try {
      const { data } = await recordPlazaResultsRequest(program, changed.map((a) => ({
        application_id: a.application_id,
        site_id: choice(a) === '' ? null : Number(choice(a)),
      })));
      setResults(Object.fromEntries(data.map((r) => [r.application_id, r])));
      setEdits((prev) => {
        const next = { ...prev };
        data.filter((r) => r.ok).forEach((r) => { delete next[r.application_id]; });
        return next;
      });
      await Promise.all([reload(), loadSeats()]);
    } catch (err) {
      setSaveError(getErrorMessage(err, 'No se pudieron guardar los resultados.'));
    } finally {
      setSaving(false);
    }
  };

  const actions = promotion && (
    <div className="flex flex-wrap items-center gap-3">
      <Link to={`${config.listPath}?promotion_id=${promotion.promotion_id}`} className="btn-secondary">Ver inscripciones</Link>
      <button type="button" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSave}
        disabled={saving || changed.length === 0}>
        {saving ? 'Guardando...' : `Guardar resultados${changed.length ? ` (${changed.length})` : ''}`}
      </button>
    </div>
  );

  return (
    <Layout>
      <PageLayout title={`Resultados del acto · ${config.name}`} actions={actions}>
        {loadingPromotions && <LoadingSpinner />}
        {!loadingPromotions && promotionsError && <DataLoadError title="No se pudieron cargar las promociones" message={promotionsError} />}
        {promotion && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="form-label" htmlFor="act-promotion">Promoción</label>
                <select id="act-promotion" className="form-input" value={promotionId ?? ''} onChange={(e) => selectPromotion(Number(e.target.value))}>
                  {promotions.map((p) => <option key={p.promotion_id} value={p.promotion_id}>{promotionLabel(p)}{p.is_finished ? ' (finalizada)' : ''}</option>)}
                </select>
              </div>
              <p className="max-w-2xl text-sm text-gray-600">
                Captura la {config.placeLabel.toLowerCase()} que eligió cada alumno, en el orden del acto (promedio de mayor a menor).
                Solo aparecen quienes aceptaron su asignación; para elegir, sus documentos de inscripción deben estar aprobados.
              </p>
            </div>

            {psdsError && <div className="alert-error">{psdsError}</div>}
            {!psdsError && psds?.length === 0 && (
              <div className="alert-error">
                La promoción no tiene cupos por {config.placeLabel.toLowerCase()}.{' '}
                <Link to={adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(promotion.promotion_id))} className="font-semibold underline">Capturar cupos</Link>
              </div>
            )}
            {psds?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {psds.map((p) => {
                  const left = remaining[String(p.site_id)];
                  return (
                    <span key={p.psd_id} className={`rounded-full px-2 py-1 ring-1 ring-inset ${left > 0 ? 'bg-gray-50 text-gray-700 ring-gray-200' : 'bg-red-50 text-red-700 ring-red-200'}`}>
                      {p.site?.name}: {left} de {p.capacity} libres
                    </span>
                  );
                })}
              </div>
            )}
            {saveError && <div className="alert-error">{saveError}</div>}

            {loading && <LoadingSpinner />}
            {!loading && error && <DataLoadError title="No se pudieron cargar las inscripciones" message={error} onRetry={reload} />}
            {!loading && !error && (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="w-16 !px-2">#</th>
                      <th className="w-1/4 text-left">Alumno</th>
                      <th className="w-32">Promedio</th>
                      <th className="w-40">Documentos</th>
                      <th className="text-left">{config.placeLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr><td colSpan={5} className="py-6 text-center text-gray-500">Nadie ha aceptado su asignación en esta promoción todavía.</td></tr>
                    )}
                    {rows.map((a, index) => {
                      const value = choice(a);
                      const result = results[a.application_id];
                      const blocked = !a.inscription_progress?.complete && !saved(a);
                      return (
                        <tr key={a.application_id}>
                          <td className="!px-2">{index + 1}</td>
                          <td className="text-left">
                            <Link to={config.detailPath(a.application_id)} className="hover:underline">{formatFullName(a.student) || a.academic_id}</Link>
                            <span className="block font-mono text-xs text-gray-500">{a.academic_id}</span>
                          </td>
                          <td>{formatAverage(a.average)}</td>
                          <td><DocumentsStatus progress={a.inscription_progress} /></td>
                          <td className="!whitespace-normal text-left">
                            <select className="form-input_full" value={value} disabled={saving || blocked}
                              aria-label={`${config.placeLabel} de ${formatFullName(a.student)}`}
                              onChange={(e) => handleChange(a, e.target.value)}>
                              <option value="">Sin {config.placeLabel.toLowerCase()}</option>
                              {(psds ?? []).map((p) => {
                                const id = String(p.site_id);
                                const full = remaining[id] <= 0 && value !== id;
                                return <option key={p.psd_id} value={id} disabled={full}>{p.site?.name}{full ? ' (sin cupo)' : ''}</option>;
                              })}
                            </select>
                            {blocked && <p className="mt-1 text-xs text-gray-500">Faltan documentos de inscripción aprobados.</p>}
                            {result && (
                              <p className={`mt-1 text-xs ${result.ok ? 'text-green-700' : 'text-red-700'}`}>{result.ok ? 'Guardado.' : result.detail}</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </PageLayout>
    </Layout>
  );
}

export default PlazaResultsPage;
