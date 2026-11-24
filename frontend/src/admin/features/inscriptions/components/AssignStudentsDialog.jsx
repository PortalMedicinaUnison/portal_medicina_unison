import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../utils/ui/Modal';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import { bulkAssignRequest, getCandidatesRequest } from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';
import { formatFullName, normalizeText, promotionLabel } from '../../../../utils/utils';
import { parseStudentList } from '../programs';


/**
 * Asigna alumnos a la promoción eligiéndolos de la lista de candidatos o pegando expedientes
 * (con promedio, opcional). Muestra qué se asignó y qué no, con el motivo.
 * Se monta de nuevo en cada apertura (key en el padre).
 */
function AssignStudentsDialog({ config, promotion, onClose, onAssigned }) {
  const [mode, setMode] = useState('pick');
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [selected, setSelected] = useState(() => new Set());
  const [search, setSearch] = useState('');
  const [pasted, setPasted] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    getCandidatesRequest(config.program, promotion.promotion_id)
      .then(({ data }) => { if (active) setCandidates(data); })
      .catch((err) => { if (active) setError(getErrorMessage(err, 'No se pudo cargar la lista de alumnos.')); })
      .finally(() => { if (active) setLoadingCandidates(false); });
    return () => { active = false; };
  }, [config.program, promotion.promotion_id]);

  const visible = useMemo(() => {
    const term = normalizeText(search.trim());
    if (!term) return candidates;
    return candidates.filter((c) => normalizeText(`${formatFullName(c)} ${c.academic_id} ${c.email}`).includes(term));
  }, [candidates, search]);

  const pastedRows = useMemo(() => parseStudentList(pasted), [pasted]);
  const allVisibleSelected = visible.length > 0 && visible.every((c) => selected.has(c.academic_id));
  const count = mode === 'pick' ? selected.size : pastedRows.length;

  const toggle = (academicId) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(academicId)) next.delete(academicId); else next.add(academicId);
    return next;
  });

  const toggleAllVisible = () => setSelected((prev) => {
    const next = new Set(prev);
    visible.forEach((c) => (allVisibleSelected ? next.delete(c.academic_id) : next.add(c.academic_id)));
    return next;
  });

  const handleSubmit = async () => {
    const students = mode === 'pick'
      ? [...selected].map((academicId) => ({ academic_id: academicId }))
      : pastedRows;
    if (students.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      const { data } = await bulkAssignRequest(config.program, promotion.promotion_id, students);
      setResult(data);
      if (data.created.length || data.updated.length) onAssigned?.();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo hacer la asignación.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Asignar alumnos · ${config.name} ${promotionLabel(promotion)}`}>
      {result ? (
        <div className="space-y-4 text-sm">
          <p className="text-gray-800">
            <strong>{result.created.length}</strong> asignados
            {result.updated.length > 0 && <>, <strong>{result.updated.length}</strong> con promedio actualizado</>}
            {result.skipped.length > 0 && <>, <strong>{result.skipped.length}</strong> no asignados</>}.
          </p>
          {result.skipped.length > 0 && (
            <ul className="max-h-60 overflow-y-auto rounded-md border border-gray-200 divide-y">
              {result.skipped.map((row) => (
                <li key={row.academic_id} className="px-3 py-2">
                  <span className="font-mono">{row.academic_id}</span> — <span className="text-red-700">{row.reason}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end">
            <button type="button" className="btn-primary" onClick={onClose}>Listo</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="inline-flex rounded-md ring-1 ring-gray-300" role="tablist">
            {[['pick', 'Elegir de la lista'], ['paste', 'Pegar expedientes']].map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                className={`px-3 py-1.5 text-sm first:rounded-l-md last:rounded-r-md ${mode === value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                onClick={() => setMode(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === 'pick' && (
            <div className="space-y-2">
              <input
                type="search"
                className="form-input_full"
                placeholder="Buscar por nombre, expediente o correo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar alumnos"
              />
              {loadingCandidates && <LoadingSpinner />}
              {!loadingCandidates && candidates.length === 0 && (
                <p className="text-sm text-gray-600">
                  No hay alumnos disponibles: los registrados ya están en esta promoción o tienen el {config.recordName} en curso o acreditado
                  {config.recordKey === 'social_service' && ' (o aún no acreditan el internado)'}.
                </p>
              )}
              {!loadingCandidates && candidates.length > 0 && (
                <>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} />
                    Seleccionar {search ? 'los mostrados' : 'todos'} ({visible.length})
                  </label>
                  <ul className="max-h-72 overflow-y-auto rounded-md border border-gray-200 divide-y">
                    {visible.map((c) => (
                      <li key={c.academic_id}>
                        <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
                          <input type="checkbox" checked={selected.has(c.academic_id)} onChange={() => toggle(c.academic_id)} />
                          <span className="min-w-0 flex-1 truncate">{formatFullName(c)}</span>
                          <span className="font-mono text-xs text-gray-500">{c.academic_id}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {mode === 'paste' && (
            <div className="space-y-2">
              <label className="form-label" htmlFor="paste-students">Un alumno por línea</label>
              <textarea
                id="paste-students"
                className="form-input_full min-h-40 font-mono text-sm"
                placeholder={'222000001 92.35\n222000002, 88,10\n222000003'}
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Expediente y, si lo tienes, el promedio general (puedes copiar dos columnas de Excel). Si el alumno ya está
                en la promoción, solo se actualiza su promedio.
              </p>
            </div>
          )}

          {error && <div className="alert-error">{error}</div>}

          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="button" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={saving || count === 0}>
              {saving ? 'Asignando...' : `Asignar${count ? ` (${count})` : ''}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default AssignStudentsDialog;
