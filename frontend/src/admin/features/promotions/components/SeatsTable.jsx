import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import { getErrorMessage } from '../../../../utils/errors';
import { normalizeText, promotionLabel } from '../../../../utils/utils';
import { PROGRAMS } from '../../../../utils/constants';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import { MAX_CAPACITY } from '../hooks/useSeatsEditor';

const OF_PROGRAM = { [PROGRAMS.INTERNSHIP]: 'el internado', [PROGRAMS.SOCIAL_SERVICE]: 'el servicio social' };

/**
 * Tabla de cupos de la promoción: todas las sedes que ofrecen el programa (y las que ya tenían cupo).
 * "Copiar" la rellena con los cupos de otra promoción para revisarlos. El estado vive en
 * useSeatsEditor y se guarda con el botón de la página, junto con los datos de la promoción.
 */
function SeatsTable({ editor, promotion, busy, savedCount = 0 }) {
  const { program } = editor;
  const [search, setSearch] = useState('');
  const [onlyWithSeats, setOnlyWithSeats] = useState(false);
  const [copyFrom, setCopyFrom] = useState('');
  const [copying, setCopying] = useState(false);
  const [notice, setNotice] = useState(null);   // { ok, text }

  // Tras guardar ya no aplica el aviso de "revísalos y guarda".
  useEffect(() => { setNotice(null); }, [savedCount]);

  // Por defecto se copia de la promoción anterior a esta (o de la más reciente).
  const defaultSource = useMemo(
    () => editor.others.find((p) => p.year < promotion.year || (p.year === promotion.year && p.period < promotion.period))
      ?? editor.others[0] ?? null,
    [editor.others, promotion.year, promotion.period],
  );
  const source = copyFrom || (defaultSource ? String(defaultSource.promotion_id) : '');

  if (editor.loading) return <LoadingSpinner />;
  if (editor.loadError) {
    return <DataLoadError title="No se pudieron cargar los cupos" message={editor.loadError} onRetry={() => editor.reload()} />;
  }

  const query = normalizeText(search.trim());
  const visible = editor.rows.filter((row) => (!query || normalizeText(row.site.name).includes(query))
    && (!onlyWithSeats || editor.capacityOf(row) > 0 || (row.psd?.capacity ?? 0) > 0));
  const total = editor.rows.reduce((sum, row) => sum + (editor.capacityOf(row) || 0), 0);
  const occupiedTotal = editor.rows.reduce((sum, row) => sum + (row.psd?.occupied ?? 0), 0);

  const handleCopy = async () => {
    if (!source) return;
    setCopying(true);
    setNotice(null);
    try {
      const missing = await editor.copyFrom(Number(source));
      const from = editor.others.find((p) => String(p.promotion_id) === source);
      setNotice({
        ok: true,
        text: `Se copiaron los cupos de ${promotionLabel(from)}. Revísalos y guarda.`
          + (missing ? ` ${missing} sede(s) de esa promoción ya no ofrecen cupos para ${OF_PROGRAM[program]} y no se copiaron.` : ''),
      });
    } catch (err) {
      setNotice({ ok: false, text: getErrorMessage(err, 'No se pudieron copiar los cupos.') });
    } finally {
      setCopying(false);
    }
  };

  const disabled = busy || copying;

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
        {editor.others.length > 0 && (
          <div className="flex items-end gap-2 md:ml-auto">
            <div>
              <label className="form-label" htmlFor="seats-copy">Copiar cupos de</label>
              <select id="seats-copy" className="form-input" value={source} onChange={(e) => setCopyFrom(e.target.value)} disabled={disabled}>
                {editor.others.map((p) => <option key={p.promotion_id} value={p.promotion_id}>{promotionLabel(p)}</option>)}
              </select>
            </div>
            <button type="button" className="btn-secondary" onClick={handleCopy} disabled={disabled || !source}>Copiar</button>
          </div>
        )}
      </div>

      {notice && <div className={notice.ok ? 'alert-success' : 'alert-error'}>{notice.text}</div>}

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
                  {editor.rows.length === 0
                    ? `No hay sedes que ofrezcan cupos para ${OF_PROGRAM[program]}.`
                    : 'Ninguna sede coincide con la búsqueda.'}
                </td>
              </tr>
            )}
            {visible.map((row) => {
              const siteId = row.site.site_id;
              const problem = editor.problemOf(row);
              return (
                <tr key={siteId} className={editor.isChanged(row) ? 'bg-amber-50' : undefined}>
                  <td className="!whitespace-normal text-left">
                    {row.site.name}
                    <span className="block text-xs text-gray-500">
                      {row.site.city}{row.serves ? '' : ` · ya no ofrece cupos para ${OF_PROGRAM[program]}`}
                    </span>
                  </td>
                  <td>{row.psd?.occupied ?? 0}</td>
                  <td className="!whitespace-normal">
                    <input type="number" inputMode="numeric" min={row.psd?.occupied ?? 0} max={MAX_CAPACITY} step={1}
                      placeholder="0" value={editor.valueOf(row)} disabled={disabled}
                      className={`form-input mx-auto w-16 text-center md:w-28 ${problem ? 'border-red-500' : ''}`}
                      aria-label={`Cupo de ${row.site.name}`} aria-invalid={Boolean(problem)}
                      onChange={(e) => { editor.setValue(siteId, e.target.value); setNotice(null); }} />
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

      <p className="max-w-xl text-sm text-gray-500">
        Deja el cupo vacío o en 0 para que la sede no tenga lugares en esta promoción. ¿Falta una sede?{' '}
        <Link to={adminAbs(ROUTES.ADMIN.SITE_CREATE)} className="underline">Regístrala</Link> marcando que ofrece cupos para {OF_PROGRAM[program]}.
      </p>
    </div>
  );
}

export default SeatsTable;
