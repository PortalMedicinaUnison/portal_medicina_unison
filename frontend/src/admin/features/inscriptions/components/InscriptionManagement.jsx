import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPsdsByPromotionIdRequest } from '../../../../services/promotionService';
import { updateInscriptionRequest } from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';
import { isExitStatus } from '../../../../utils/constants';
import { todayISO } from '../../../../utils/utils';

const MAX_REASON = 500;  // como el backend

const fromApplication = (application, record) => ({
  average: application.average != null ? String(application.average) : '',
  site: record?.site_id != null ? String(record.site_id) : '',
  status: String(record?.status ?? ''),
  exitDate: record?.exit_date ?? '',
  exitReason: record?.exit_reason ?? '',
});

/**
 * Administración de una inscripción con un solo "Guardar": promedio y, si ya aceptó, la sede o plaza
 * y el estatus de su internado o servicio social (la renuncia y la baja con fecha y motivo). Lo que
 * cambió viaja en una petición y el backend lo guarda todo o nada, con las mismas reglas de siempre
 * (cupo, documentos aprobados).
 */
function InscriptionManagement({ config, application, onSaved }) {
  const record = application[config.recordKey];
  const [psds, setPsds] = useState([]);
  const [psdsError, setPsdsError] = useState(null);
  const original = useMemo(
    () => fromApplication(application, record),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [application.average, record?.site_id, record?.status, record?.exit_date, record?.exit_reason],
  );
  const [form, setForm] = useState(original);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { ok, text }

  // Tras guardar (o si cambia en otro lado) el formulario toma lo registrado; el mensaje se conserva.
  useEffect(() => { setForm(original); }, [original]);

  const loadSeats = useCallback(async () => {
    if (!record) return;
    try {
      const { data } = await getPsdsByPromotionIdRequest(application.promotion_id);
      setPsds(data);
      setPsdsError(null);
    } catch (err) {
      setPsdsError(getErrorMessage(err, 'No se pudieron cargar los cupos de la promoción.'));
    }
  }, [application.promotion_id, record]);

  useEffect(() => { loadSeats(); }, [loadSeats]);

  const hasLeft = isExitStatus(original.status);
  const exitSelected = isExitStatus(form.status);
  const exitName = Number(form.status) === 4 ? 'renuncia' : 'baja';
  const changed = {
    average: form.average.trim().replace(',', '.') !== original.average,
    site: Boolean(record) && form.site !== original.site,
    status: Boolean(record) && form.status !== original.status,
    exit: Boolean(record) && exitSelected && (form.exitDate !== original.exitDate || form.exitReason.trim() !== original.exitReason),
  };
  const dirty = Object.values(changed).some(Boolean);
  const pending = [
    changed.average && 'promedio',
    changed.site && config.placeLabel.toLowerCase(),
    (changed.status || changed.exit) && (exitSelected ? exitName : 'estatus'),
  ].filter(Boolean);

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Al elegir renuncia o baja se parte de lo ya registrado (o de hoy, sin motivo).
      if (field === 'status' && isExitStatus(value) && !isExitStatus(prev.status)) {
        next.exitDate = original.exitDate || todayISO();
        next.exitReason = original.exitReason;
      }
      return next;
    });
    setMessage(null);
  };

  const handleDiscard = () => {
    setForm(original);
    setMessage(null);
  };

  const handleSave = async () => {
    const payload = {};
    if (changed.average) {
      const text = form.average.trim().replace(',', '.');
      const number = text === '' ? null : Number(text);
      if (number != null && !(Number.isFinite(number) && number >= 0 && number <= 100)) {
        setMessage({ ok: false, text: 'El promedio debe estar entre 0 y 100.' });
        return;
      }
      payload.average = number;
    }
    if (changed.site || changed.status || changed.exit) {
      const recordData = {};
      if (changed.site) recordData.site_id = form.site === '' ? null : Number(form.site);
      if (changed.status) recordData.status = Number(form.status);
      if (exitSelected) {
        const reason = form.exitReason.trim();
        let problem = null;
        if (!form.exitDate) problem = `Indica la fecha de la ${exitName}.`;
        else if (form.exitDate > todayISO()) problem = 'La fecha no puede ser posterior a hoy.';
        else if (!reason) problem = `Indica el motivo de la ${exitName}.`;
        if (problem) {
          setMessage({ ok: false, text: problem });
          return;
        }
        Object.assign(recordData, { exit_date: form.exitDate, exit_reason: reason });
      }
      payload.record = recordData;
    }

    setSaving(true);
    setMessage(null);
    try {
      await updateInscriptionRequest(config.program, application.application_id, payload);
      await Promise.all([onSaved?.(), loadSeats()]);
      setMessage({ ok: true, text: 'Cambios guardados.' });
    } catch (err) {
      setMessage({ ok: false, text: getErrorMessage(err, 'No se pudieron guardar los cambios.') });
    } finally {
      setSaving(false);
    }
  };

  const currentSite = original.site;
  const showCurrentOption = currentSite && !psds.some((p) => String(p.site_id) === currentSite);

  return (
    <div className="flex flex-col gap-6">
      <dl className="item-list">
        <div className="item-row">
          <dt className="item-header"><label htmlFor="inscription-average">Promedio general</label></dt>
          <dd className="item-text">
            <input id="inscription-average" type="text" inputMode="decimal" className="form-input w-28 grow-0" value={form.average}
              placeholder="—" onChange={(e) => update('average', e.target.value)} disabled={saving} />
            <p className="mt-1 text-xs text-gray-500">
              De 0 a 100 con dos decimales; ordena la elección de {config.placeLabel.toLowerCase()} en el acto.
            </p>
          </dd>
        </div>

        {record && (
          <div className="item-row">
            <dt className="item-header"><label htmlFor="record-site">{config.placeLabel}</label></dt>
            <dd className="item-text">
              <select id="record-site" className="form-input--half" value={form.site}
                onChange={(e) => update('site', e.target.value)} disabled={saving || hasLeft}>
                <option value="">Sin {config.placeLabel.toLowerCase()}</option>
                {showCurrentOption && <option value={currentSite}>{record.site?.name} — sin cupo registrado en la promoción</option>}
                {psds.map((psd) => {
                  const isCurrent = String(psd.site_id) === currentSite;
                  const full = psd.occupied >= psd.capacity && !isCurrent;
                  return (
                    <option key={psd.psd_id} value={psd.site_id} disabled={full}>
                      {`${psd.site?.name ?? `Sede ${psd.site_id}`} — ${psd.capacity - psd.occupied} de ${psd.capacity} libres${full ? ' (sin cupo)' : ''}`}
                    </option>
                  );
                })}
              </select>
              {hasLeft && currentSite && (
                <p className="mt-2 text-sm text-gray-500">Su lugar quedó libre por la {Number(original.status) === 4 ? 'renuncia' : 'baja'}.</p>
              )}
              {psdsError && <p className="mt-2 text-sm text-red-600">{psdsError}</p>}
            </dd>
          </div>
        )}

        {record && (
          <div className="item-row">
            <dt className="item-header"><label htmlFor="record-status">Estatus</label></dt>
            <dd className="item-text">
              <select id="record-status" className="form-input--half" value={form.status}
                onChange={(e) => update('status', e.target.value)} disabled={saving}>
                {Object.entries(config.recordStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              {exitSelected && (
                <div className="mt-4 flex max-w-xl flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 p-4">
                  <div>
                    <label className="form-label" htmlFor="record-exit-date">Fecha de la {exitName} *</label>
                    <input id="record-exit-date" type="date" className="form-input" value={form.exitDate} max={todayISO()}
                      onChange={(e) => update('exitDate', e.target.value)} disabled={saving} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="record-exit-reason">Motivo *</label>
                    <textarea id="record-exit-reason" className="form-input_full" rows={3} maxLength={MAX_REASON} value={form.exitReason}
                      placeholder={Number(form.status) === 4 ? 'Ej. Entregó el formato de renuncia firmado el…' : 'Causal de la baja y quién la notificó'}
                      onChange={(e) => update('exitReason', e.target.value)} disabled={saving} />
                    <p className="mt-1 text-xs text-gray-600">El alumno verá la fecha y este motivo en su portal.</p>
                  </div>
                  <p className="text-xs text-gray-700">{config.exitHints[Number(form.status)]}</p>
                </div>
              )}
            </dd>
          </div>
        )}
      </dl>

      {!record && (
        <p className="text-sm text-gray-600">
          El {config.recordName} se crea cuando el alumno acepta su asignación; entonces podrás registrar
          su {config.placeLabel.toLowerCase()} y su estatus.
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
        {message && <div className={message.ok ? 'alert-success' : 'alert-error'}>{message.text}</div>}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="mr-auto text-sm text-gray-500" aria-live="polite">
            {pending.length > 0 ? `Cambios sin guardar: ${pending.join(', ')}.` : 'Sin cambios por guardar.'}
          </p>
          {dirty && (
            <button type="button" className="btn-secondary" onClick={handleDiscard} disabled={saving}>Descartar cambios</button>
          )}
          <button type="button" className="btn-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={handleSave}
            disabled={!dirty || saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InscriptionManagement;
