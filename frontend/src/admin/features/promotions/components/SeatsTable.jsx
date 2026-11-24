import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import { getAllSitesRequest } from '../../../../services/siteService';
import { getAllPromotionsRequest, getPsdsByPromotionIdRequest, setSeatsRequest } from '../../../../services/promotionService';
import { getErrorMessage } from '../../../../utils/errors';
import { normalizeText, promotionLabel } from '../../../../utils/utils';
import { PROGRAMS } from '../../../../utils/constants';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';

const MAX_CAPACITY = 1000;  // como el backend
const OF_PROGRAM = { [PROGRAMS.INTERNSHIP]: 'el internado', [PROGRAMS.SOCIAL_SERVICE]: 'el servicio social' };
const byNewest = (a, b) => (b.year - a.year) || (b.period - a.period);

// '' o vacío = sin cupo (0); NaN si no es un entero.
function parseCapacity(value) {
  const text = String(value ?? '').trim();
  if (text === '') return 0;
  return /^\d+$/.test(text) ? Number(text) : NaN;
}

/**
 * Cupos de la promoción en una sola tabla: todas las sedes que ofrecen el programa (y las que ya
 * tenían cupo), capturadas de una vez. "Copiar" rellena la tabla con los cupos de otra promoción
 * para revisarlos antes de guardar. El guardado es todo o nada.
 */
function SeatsTable({ promotion }) {
  const { promotion_id: promotionId, program, year, period } = promotion;
  const [sites, setSites] = useState([]);
  const [psds, setPsds] = useState([]);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [edits, setEdits] = useState({});   // site_id → lo capturado
  const [search, setSearch] = useState('');
  const [onlyWithSeats, setOnlyWithSeats] = useState(false);
  const [copyFrom, setCopyFrom] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [sitesResponse, psdsResponse, promotionsResponse] = await Promise.all([
        getAllSitesRequest({ program }),
        getPsdsByPromotionIdRequest(promotionId),
        getAllPromotionsRequest({ program }),
      ]);
      setSites(sitesResponse.data);
      setPsds(psdsResponse.data);
      setOthers(promotionsResponse.data.filter((p) => p.promotion_id !== promotionId).sort(byNewest));
    } catch (err) {
      setLoadError(getErrorMessage(err, 'No se pudieron cargar las sedes y los cupos.'));
    } finally {
      setLoading(false);
    }
  }, [program, promotionId]);

  useEffect(() => { load(); }, [load]);

  // Por defecto se copia de la promoción anterior a esta (o de la más reciente).
  const defaultSource = useMemo(
    () => others.find((p) => p.year < year || (p.year === year && p.period < period)) ?? others[0] ?? null,
    [others, year, period],
  );
  const source = copyFrom || (defaultSource ? String(defaultSource.promotion_id) : '');

  const rows = useMemo(() => {
    const bySite = new Map(sites.map((site) => [site.site_id, { site, psd: null, serves: true }]));
    psds.forEach((psd) => {
      const row = bySite.get(psd.site_id);
      if (row) row.psd = psd;
      else bySite.set(psd.site_id, { site: psd.site, psd, serves: false });
    });
    return [...bySite.values()].sort((a, b) => a.site.name.localeCompare(b.site.name, 'es'));
  }, [sites, psds]);

  const savedValue = (row) => (row.psd ? String(row.psd.capacity) : '');
  const valueOf = (row) => edits[row.site.site_id] ?? savedValue(row);
  const isChanged = (row) => edits[row.site.site_id] !== undefined
    && parseCapacity(edits[row.site.site_id]) !== (row.psd?.capacity ?? 0);
  const problemOf = (row) => {
    const capacity = parseCapacity(valueOf(row));
    if (Number.isNaN(capacity) || capacity > MAX_CAPACITY) return `Captura un entero de 0 a ${MAX_CAPACITY}.`;
    const occupied = row.psd?.occupied ?? 0;
    return capacity < occupied ? `No puede ser menor que los ${occupied} ya asignados.` : null;
  };

  const changed = rows.filter(isChanged);
  const invalid = rows.filter((row) => problemOf(row));
  const query = normalizeText(search.trim());
  const visible = rows.filter((row) => (!query || normalizeText(row.site.name).includes(query))
    && (!onlyWithSeats || parseCapacity(valueOf(row)) > 0 || (row.psd?.capacity ?? 0) > 0));
  const total = rows.reduce((sum, row) => sum + (parseCapacity(valueOf(row)) || 0), 0);
  const occupiedTotal = rows.reduce((sum, row) => sum + (row.psd?.occupied ?? 0), 0);

  const clearMessages = () => {
    setError(null);
    setNotice(null);
  };

  const handleChange = (siteId, value) => {
    setEdits((prev) => ({ ...prev, [siteId]: value }));
    clearMessages();
  };

  const handleCopy = async () => {
    if (!source) return;
    setBusy(true);
    clearMessages();
    try {
      const { data } = await getPsdsByPromotionIdRequest(Number(source));
      const capacities = new Map(data.map((psd) => [psd.site_id, psd.capacity]));
      setEdits(Object.fromEntries(rows.map((row) => [
        row.site.site_id, capacities.has(row.site.site_id) ? String(capacities.get(row.site.site_id)) : '',
      ])));
      const missing = data.filter((psd) => !rows.some((row) => row.site.site_id === psd.site_id)).length;
      const from = others.find((p) => String(p.promotion_id) === source);
      setNotice(`Se copiaron los cupos de ${promotionLabel(from)}. Revísalos y guarda.`
        + (missing ? ` ${missing} sede(s) de esa promoción ya no ofrecen cupos para ${OF_PROGRAM[program]} y no se copiaron.` : ''));
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron copiar los cupos.'));
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (changed.length === 0 || invalid.length > 0) return;
    setBusy(true);
    clearMessages();
    try {
      const seats = changed.map((row) => ({ site_id: row.site.site_id, capacity: parseCapacity(valueOf(row)) }));
      const { data } = await setSeatsRequest(promotionId, seats);
      setPsds(data);
      setEdits({});
      setNotice(`Cupos guardados (${seats.length} ${seats.length === 1 ? 'sede' : 'sedes'}).`);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los cupos.'));
    } finally {
      setBusy(false);
    }
  };

  const handleDiscard = () => {
    setEdits({});
    clearMessages();
  };

  if (loading) return <LoadingSpinner />;
  if (loadError) return <DataLoadError title="No se pudieron cargar los cupos" message={loadError} onRetry={load} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="form-label" htmlFor="seats-search">Buscar sede</label>
          <input id="seats-search" type="search" className="form-input--sm" value={search}
            onChange={(e) => setSearch(e.target.value)} placeholder="Nombre de la sede" />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
          <input type="checkbox" className="h-4 w-4" checked={onlyWithSeats} onChange={(e) => setOnlyWithSeats(e.target.checked)} />
          Solo sedes con cupo
        </label>
        {others.length > 0 && (
          <div className="flex items-end gap-2 md:ml-auto">
            <div>
              <label className="form-label" htmlFor="seats-copy">Copiar cupos de</label>
              <select id="seats-copy" className="form-input" value={source} onChange={(e) => setCopyFrom(e.target.value)} disabled={busy}>
                {others.map((p) => <option key={p.promotion_id} value={p.promotion_id}>{promotionLabel(p)}</option>)}
              </select>
            </div>
            <button type="button" className="btn-secondary" onClick={handleCopy} disabled={busy || !source}>Copiar</button>
          </div>
        )}
      </div>

      {error && <div className="alert-error">{error}</div>}
      {notice && <div className="alert-success">{notice}</div>}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="text-left">Sede</th>
              <th className="w-24 md:w-36">Ocupados</th>
              <th className="w-24 md:w-44">Cupo</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={3} className="!whitespace-normal py-6 text-center text-gray-500">
                  {rows.length === 0
                    ? `No hay sedes que ofrezcan cupos para ${OF_PROGRAM[program]}.`
                    : 'Ninguna sede coincide con la búsqueda.'}
                </td>
              </tr>
            )}
            {visible.map((row) => {
              const siteId = row.site.site_id;
              const problem = problemOf(row);
              return (
                <tr key={siteId} className={isChanged(row) ? 'bg-amber-50' : undefined}>
                  <td className="!whitespace-normal text-left">
                    {row.site.name}
                    <span className="block text-xs text-gray-500">
                      {row.site.city}{row.serves ? '' : ` · ya no ofrece cupos para ${OF_PROGRAM[program]}`}
                    </span>
                  </td>
                  <td>{row.psd?.occupied ?? 0}</td>
                  <td className="!whitespace-normal">
                    <input type="number" inputMode="numeric" min={row.psd?.occupied ?? 0} max={MAX_CAPACITY} step={1}
                      placeholder="0" value={valueOf(row)} disabled={busy}
                      className={`form-input mx-auto w-16 text-center md:w-28 ${problem ? 'border-red-500' : ''}`}
                      aria-label={`Cupo de ${row.site.name}`} aria-invalid={Boolean(problem)}
                      onChange={(e) => handleChange(siteId, e.target.value)} />
                    {problem && <p className="mt-1 text-xs text-red-700">{problem}</p>}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="text-left">Total</td>
              <td>{occupiedTotal}</td>
              <td>{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <p className="mr-auto max-w-xl text-sm text-gray-500">
          Deja el cupo vacío o en 0 para que la sede no tenga lugares en esta promoción. ¿Falta una sede?{' '}
          <Link to={adminAbs(ROUTES.ADMIN.SITE_CREATE)} className="underline">Regístrala</Link> marcando que ofrece cupos para {OF_PROGRAM[program]}.
        </p>
        {changed.length > 0 && (
          <button type="button" className="btn-secondary" onClick={handleDiscard} disabled={busy}>Descartar cambios</button>
        )}
        <button type="button" className="btn-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={handleSave}
          disabled={busy || changed.length === 0 || invalid.length > 0}>
          {busy ? 'Guardando...' : `Guardar cupos${changed.length ? ` (${changed.length})` : ''}`}
        </button>
      </div>
    </div>
  );
}

export default SeatsTable;
