import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllSitesRequest } from '../../../../services/siteService';
import { getAllPromotionsRequest, getPsdsByPromotionIdRequest } from '../../../../services/promotionService';
import { getErrorMessage } from '../../../../utils/errors';

export const MAX_CAPACITY = 1000;  // como el backend
const byNewest = (a, b) => (b.year - a.year) || (b.period - a.period);

// '' o vacío = sin cupo (0); NaN si no es un entero.
function parseCapacity(value) {
  const text = String(value ?? '').trim();
  if (text === '') return 0;
  return /^\d+$/.test(text) ? Number(text) : NaN;
}

/**
 * Cupos de una promoción mientras se editan: todas las sedes que ofrecen el programa (y las que ya
 * tenían cupo), lo capturado, lo que cambió y lo que no es válido. Guardarlos le toca a la página,
 * junto con los datos de la promoción (`seats` en la misma petición).
 */
export default function useSeatsEditor(promotion) {
  const promotionId = promotion?.promotion_id;
  const program = promotion?.program;
  const [sites, setSites] = useState([]);
  const [psds, setPsds] = useState([]);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [edits, setEdits] = useState({});   // site_id → lo capturado

  // silent: recarga tras guardar sin volver a mostrar "cargando".
  const load = useCallback(async ({ silent = false } = {}) => {
    if (!promotionId) return;
    if (!silent) setLoading(true);
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

  const rows = useMemo(() => {
    const bySite = new Map(sites.map((site) => [site.site_id, { site, psd: null, serves: true }]));
    psds.forEach((psd) => {
      const row = bySite.get(psd.site_id);
      if (row) row.psd = psd;
      else bySite.set(psd.site_id, { site: psd.site, psd, serves: false });
    });
    return [...bySite.values()].sort((a, b) => a.site.name.localeCompare(b.site.name, 'es'));
  }, [sites, psds]);

  const valueOf = useCallback(
    (row) => edits[row.site.site_id] ?? (row.psd ? String(row.psd.capacity) : ''),
    [edits],
  );
  const capacityOf = useCallback((row) => parseCapacity(valueOf(row)), [valueOf]);
  const isChanged = useCallback(
    (row) => edits[row.site.site_id] !== undefined && parseCapacity(edits[row.site.site_id]) !== (row.psd?.capacity ?? 0),
    [edits],
  );
  const problemOf = useCallback((row) => {
    const capacity = parseCapacity(valueOf(row));
    if (Number.isNaN(capacity) || capacity > MAX_CAPACITY) return `Captura un entero de 0 a ${MAX_CAPACITY}.`;
    const occupied = row.psd?.occupied ?? 0;
    return capacity < occupied ? `No puede ser menor que los ${occupied} ya asignados.` : null;
  }, [valueOf]);

  const changed = rows.filter(isChanged);
  const invalid = rows.filter((row) => problemOf(row));

  const setValue = useCallback((siteId, value) => setEdits((prev) => ({ ...prev, [siteId]: value })), []);
  const discard = useCallback(() => setEdits({}), []);

  // Rellena la tabla con los cupos de otra promoción (para revisarlos antes de guardar).
  // Devuelve cuántas sedes de esa promoción ya no ofrecen el programa y no se copiaron.
  const copyFrom = useCallback(async (sourceId) => {
    const { data } = await getPsdsByPromotionIdRequest(sourceId);
    const capacities = new Map(data.map((psd) => [psd.site_id, psd.capacity]));
    setEdits(Object.fromEntries(rows.map((row) => [
      row.site.site_id, capacities.has(row.site.site_id) ? String(capacities.get(row.site.site_id)) : '',
    ])));
    return data.filter((psd) => !rows.some((row) => row.site.site_id === psd.site_id)).length;
  }, [rows]);

  // Lo que cambió, como lo espera la API: [{ site_id, capacity }].
  const seatsPayload = useCallback(
    () => changed.map((row) => ({ site_id: row.site.site_id, capacity: parseCapacity(valueOf(row)) })),
    [changed, valueOf],
  );

  // Tras guardar: se recargan los cupos y se limpia lo capturado.
  const afterSave = useCallback(async () => {
    await load({ silent: true });
    setEdits({});
  }, [load]);

  return {
    program, loading, loadError, reload: load, rows, others,
    valueOf, capacityOf, isChanged, problemOf, changed, invalid,
    setValue, discard, copyFrom, seatsPayload, afterSave,
  };
}
