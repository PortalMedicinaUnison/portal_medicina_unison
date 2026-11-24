import { useCallback, useEffect, useState } from 'react';
import { getPsdsByPromotionIdRequest } from '../../../../services/promotionService';
import { updateProgramRecordRequest } from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';
import { isExitStatus } from '../../../../utils/constants';
import { todayISO } from '../../../../utils/utils';

const MAX_REASON = 500;  // como el backend

/**
 * Sede o plaza y estatus del internado / servicio social de una inscripción aceptada.
 * La renuncia y la baja se registran con su fecha y motivo. Las reglas (cupo, documentos
 * aprobados) las aplica el backend y su mensaje se muestra aquí.
 */
function RecordManagement({ config, application, onChange }) {
  const record = application[config.recordKey];
  const [psds, setPsds] = useState([]);
  const [psdsError, setPsdsError] = useState(null);
  const [siteValue, setSiteValue] = useState(record?.site_id != null ? String(record.site_id) : '');
  const [statusValue, setStatusValue] = useState(String(record?.status ?? ''));
  const [exitDate, setExitDate] = useState(record?.exit_date ?? todayISO());
  const [exitReason, setExitReason] = useState(record?.exit_reason ?? '');
  const [saving, setSaving] = useState(null); // 'site' | 'status'
  const [message, setMessage] = useState(null); // { field, ok, text }

  const loadSeats = useCallback(async () => {
    try {
      const { data } = await getPsdsByPromotionIdRequest(application.promotion_id);
      setPsds(data);
      setPsdsError(null);
    } catch (err) {
      setPsdsError(getErrorMessage(err, 'No se pudieron cargar los cupos de la promoción.'));
    }
  }, [application.promotion_id]);

  useEffect(() => { loadSeats(); }, [loadSeats]);

  // Tras guardar (o si cambia en otro lado) el formulario toma lo registrado; el mensaje se conserva.
  useEffect(() => {
    setSiteValue(record?.site_id != null ? String(record.site_id) : '');
    setStatusValue(String(record?.status ?? ''));
    setExitDate(record?.exit_date ?? todayISO());
    setExitReason(record?.exit_reason ?? '');
  }, [record?.site_id, record?.status, record?.exit_date, record?.exit_reason]);

  const currentSite = record?.site_id != null ? String(record.site_id) : '';
  const currentStatus = String(record?.status ?? '');
  const hasLeft = isExitStatus(currentStatus);
  const exitSelected = isExitStatus(statusValue);
  const exitName = Number(statusValue) === 4 ? 'renuncia' : 'baja';
  const statusChanged = statusValue !== currentStatus || (exitSelected && (
    exitDate !== (record?.exit_date ?? '') || exitReason.trim() !== (record?.exit_reason ?? '')
  ));

  const save = async (field, data) => {
    setSaving(field);
    setMessage(null);
    try {
      await updateProgramRecordRequest(config.program, record[config.recordIdKey], data);
      await Promise.all([onChange?.(), loadSeats()]);
      setMessage({ field, ok: true, text: field === 'site' ? `${config.placeLabel} guardada.` : 'Estatus guardado.' });
    } catch (err) {
      setMessage({ field, ok: false, text: getErrorMessage(err, 'No se pudo guardar.') });
    } finally {
      setSaving(null);
    }
  };

  const handleStatusChange = (value) => {
    // Al elegir renuncia o baja se parte de lo ya registrado (o de hoy, sin motivo).
    if (isExitStatus(value) && !isExitStatus(statusValue)) {
      setExitDate(record?.exit_date ?? todayISO());
      setExitReason(record?.exit_reason ?? '');
    }
    setStatusValue(value);
    setMessage(null);
  };

  const handleSaveStatus = () => {
    if (!exitSelected) {
      save('status', { status: Number(statusValue) });
      return;
    }
    const reason = exitReason.trim();
    let problem = null;
    if (!exitDate) problem = `Indica la fecha de la ${exitName}.`;
    else if (exitDate > todayISO()) problem = 'La fecha no puede ser posterior a hoy.';
    else if (!reason) problem = `Indica el motivo de la ${exitName}.`;
    if (problem) {
      setMessage({ field: 'status', ok: false, text: problem });
      return;
    }
    save('status', { status: Number(statusValue), exit_date: exitDate, exit_reason: reason });
  };

  const showCurrentOption = currentSite && !psds.some((p) => String(p.site_id) === currentSite);

  return (
    <dl className="item-list">
      <div className="item-row">
        <dt className="item-header"><label htmlFor="record-site">{config.placeLabel}</label></dt>
        <dd className="item-text">
          <div className="flex flex-wrap items-center gap-3">
            <select id="record-site" className="form-input--half" value={siteValue}
              onChange={(e) => { setSiteValue(e.target.value); setMessage(null); }} disabled={saving != null || hasLeft}>
              <option value="">Sin {config.placeLabel.toLowerCase()}</option>
              {showCurrentOption && <option value={currentSite}>{record.site?.name} — sin cupo registrado en la promoción</option>}
              {psds.map((psd) => {
                const isCurrent = String(psd.site_id) === currentSite;
                const full = psd.occupied >= psd.capacity && !isCurrent;
                return (
                  <option key={psd.psd_id} value={psd.site_id} disabled={full}>
                    {`${psd.site?.name ?? `Sede ${psd.site_id}`} — ${psd.occupied}/${psd.capacity}${full ? ' (sin cupo)' : ''}`}
                  </option>
                );
              })}
            </select>
            {!hasLeft && (
              <button type="button" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => save('site', { site_id: siteValue === '' ? null : Number(siteValue) })}
                disabled={siteValue === currentSite || saving != null}>
                {saving === 'site' ? 'Guardando...' : `Guardar ${config.placeLabel.toLowerCase()}`}
              </button>
            )}
          </div>
          {hasLeft && currentSite && (
            <p className="mt-2 text-sm text-gray-500">Su lugar quedó libre por la {Number(currentStatus) === 4 ? 'renuncia' : 'baja'}.</p>
          )}
          {psdsError && <p className="mt-2 text-sm text-red-600">{psdsError}</p>}
          {message?.field === 'site' && <p className={`mt-2 text-sm ${message.ok ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
        </dd>
      </div>
      <div className="item-row">
        <dt className="item-header"><label htmlFor="record-status">Estatus</label></dt>
        <dd className="item-text">
          {/* Con renuncia o baja, el botón va después de la fecha y el motivo (que son obligatorios). */}
          <div className="flex flex-wrap items-center gap-3">
            <select id="record-status" className="form-input--half" value={statusValue}
              onChange={(e) => handleStatusChange(e.target.value)} disabled={saving != null}>
              {Object.entries(config.recordStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {!exitSelected && (
              <button type="button" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveStatus} disabled={!statusChanged || saving != null}>
                {saving === 'status' ? 'Guardando...' : 'Guardar estatus'}
              </button>
            )}
          </div>

          {exitSelected && (
            <div className="mt-4 flex max-w-xl flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 p-4">
              <div>
                <label className="form-label" htmlFor="record-exit-date">Fecha de la {exitName} *</label>
                <input id="record-exit-date" type="date" className="form-input" value={exitDate} max={todayISO()}
                  onChange={(e) => { setExitDate(e.target.value); setMessage(null); }} disabled={saving != null} />
              </div>
              <div>
                <label className="form-label" htmlFor="record-exit-reason">Motivo *</label>
                <textarea id="record-exit-reason" className="form-input_full" rows={3} maxLength={MAX_REASON} value={exitReason}
                  placeholder={Number(statusValue) === 4 ? 'Ej. Entregó el formato de renuncia firmado el…' : 'Causal de la baja y quién la notificó'}
                  onChange={(e) => { setExitReason(e.target.value); setMessage(null); }} disabled={saving != null} />
                <p className="mt-1 text-xs text-gray-600">El alumno verá la fecha y este motivo en su portal.</p>
              </div>
              <p className="text-xs text-gray-700">{config.exitHints[Number(statusValue)]}</p>
              <div>
                <button type="button" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSaveStatus} disabled={!statusChanged || saving != null}>
                  {saving === 'status' ? 'Guardando...' : `Registrar ${exitName}`}
                </button>
              </div>
            </div>
          )}
          {message?.field === 'status' && <p className={`mt-2 text-sm ${message.ok ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
        </dd>
      </div>
    </dl>
  );
}

export default RecordManagement;
