import { useCallback, useEffect, useState } from 'react';
import { getPsdsByPromotionIdRequest } from '../../../../services/promotionService';
import { updateProgramRecordRequest } from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';

/**
 * Sede o plaza y estatus del internado / servicio social de una inscripción aceptada.
 * Las reglas (cupo, documentos aprobados) las aplica el backend y su mensaje se muestra aquí.
 */
function RecordManagement({ config, application, onChange }) {
  const record = application[config.recordKey];
  const [psds, setPsds] = useState([]);
  const [psdsError, setPsdsError] = useState(null);
  const [siteValue, setSiteValue] = useState(record?.site_id != null ? String(record.site_id) : '');
  const [statusValue, setStatusValue] = useState(String(record?.status ?? ''));
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

  const currentSite = record?.site_id != null ? String(record.site_id) : '';
  const currentStatus = String(record?.status ?? '');

  const save = async (field, data) => {
    setSaving(field);
    setMessage(null);
    try {
      await updateProgramRecordRequest(config.program, record[config.recordIdKey], data);
      setMessage({ field, ok: true, text: field === 'site' ? `${config.placeLabel} guardada.` : 'Estatus guardado.' });
      await Promise.all([onChange?.(), loadSeats()]);
    } catch (err) {
      setMessage({ field, ok: false, text: getErrorMessage(err, 'No se pudo guardar.') });
    } finally {
      setSaving(null);
    }
  };

  const showCurrentOption = currentSite && !psds.some((p) => String(p.site_id) === currentSite);

  return (
    <dl className="item-list">
      <div className="item-row">
        <dt className="item-header"><label htmlFor="record-site">{config.placeLabel}</label></dt>
        <dd className="item-text">
          <div className="flex flex-wrap items-center gap-3">
            <select id="record-site" className="form-input--half" value={siteValue}
              onChange={(e) => { setSiteValue(e.target.value); setMessage(null); }} disabled={saving != null}>
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
            <button type="button" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => save('site', { site_id: siteValue === '' ? null : Number(siteValue) })}
              disabled={siteValue === currentSite || saving != null}>
              {saving === 'site' ? 'Guardando...' : `Guardar ${config.placeLabel.toLowerCase()}`}
            </button>
          </div>
          {psdsError && <p className="mt-2 text-sm text-red-600">{psdsError}</p>}
          {message?.field === 'site' && <p className={`mt-2 text-sm ${message.ok ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
        </dd>
      </div>
      <div className="item-row">
        <dt className="item-header"><label htmlFor="record-status">Estatus</label></dt>
        <dd className="item-text">
          <div className="flex flex-wrap items-center gap-3">
            <select id="record-status" className="form-input--half" value={statusValue}
              onChange={(e) => { setStatusValue(e.target.value); setMessage(null); }} disabled={saving != null}>
              {Object.entries(config.recordStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button type="button" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => save('status', { status: Number(statusValue) })}
              disabled={statusValue === currentStatus || saving != null}>
              {saving === 'status' ? 'Guardando...' : 'Guardar estatus'}
            </button>
          </div>
          {message?.field === 'status' && <p className={`mt-2 text-sm ${message.ok ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
        </dd>
      </div>
    </dl>
  );
}

export default RecordManagement;
