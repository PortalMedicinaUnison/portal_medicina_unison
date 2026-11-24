import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { useUser } from '../../../../contexts/UserContext';
import useCreateReport from '../hooks/useCreateReport';
import useUpdateReport from '../hooks/useUpdateReport';
import useGetSites from '../hooks/useGetSites';
import useInternshipByAcademic from '../../internships/hooks/useInternshipByAcademic';
import useSocialServiceByAcademic from '../../social-service/hooks/useSocialServiceByAcademic';
import { REPORT_TYPES, REPORT_TYPE_LABELS } from '../../../../utils/constants';
import { cleanFormData, todayISO } from '../../../../utils/utils';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import { isHttpUrl } from '../../../../utils/validations';


// Límites del backend (schemas/report.py y models/report.py).
const OTHER_TYPE_MAX_LENGTH = 25;
const EVIDENCE_URL_MAX_LENGTH = 500;

const INITIAL_FORM = {
  siteId: '',
  dateReport: '',
  reportType: '',
  otherType: '',
  description: '',
  evidenceUrl: '',
  anonymity: false,
};

// La evidencia es opcional; si se captura debe ser un enlace http(s), igual que en el backend.

// Reporte del backend → estado del formulario (modo edición).
const toFormData = (report) => ({
  siteId: report.site_id != null ? String(report.site_id) : '',
  dateReport: report.date_report ?? '',
  reportType: report.report_type != null ? String(report.report_type) : '',
  otherType: report.other_type ?? '',
  description: report.description ?? '',
  evidenceUrl: report.evidence_url ?? '',
  anonymity: Boolean(report.anonymity),
});

/**
 * Formulario de reporte del estudiante.
 * - Sin `reportId`: crea un reporte nuevo.
 * - Con `reportId`: edita `report` (solo mientras siga abierto).
 */
function ReportForm({ report = null, reportId = null, fetching = false, fetchError = null, refetch }) {
  const isEdit = reportId != null;
  const navigate = useNavigate();
  const { user } = useUser();
  const { createReport, loading: creating, success: created, error: createError, reset: resetCreate } = useCreateReport();
  const { updateReport, loading: updating, error: updateError, reset: resetUpdate } = useUpdateReport();
  const { sites, loading: fetchingSites, error: sitesError, refetch: refetchSites } = useGetSites();
  // Solo al crear: se preselecciona la sede (o plaza) del programa que el estudiante tiene en curso.
  const { internship } = useInternshipByAcademic(isEdit ? null : user?.academic_id);
  const { socialService } = useSocialServiceByAcademic(isEdit ? null : user?.academic_id);

  // Al crear, la fecha del reporte parte de hoy (se puede cambiar a un día anterior).
  const [formData, setFormData] = useState(() => (isEdit ? INITIAL_FORM : { ...INITIAL_FORM, dateReport: todayISO() }));
  const [createdId, setCreatedId] = useState(null);
  const [validationError, setValidationError] = useState('');

  const saving = creating || updating;
  const saveError = isEdit ? updateError : createError;
  const resetSave = isEdit ? resetUpdate : resetCreate;
  const isOtherType = Number(formData.reportType) === REPORT_TYPES.OTHER;

  // Sede del servicio social o del internado en curso (activo o suspendido), si existe en el catálogo.
  const defaultSiteId = useMemo(() => {
    const inCourse = (record) => record && [1, 2].includes(Number(record.status)) && (record.site?.site_id ?? record.site_id);
    const siteId = inCourse(socialService) || inCourse(internship);
    if (isEdit || !siteId || !sites.some((site) => site.site_id === siteId)) return '';
    return String(siteId);
  }, [isEdit, internship, socialService, sites]);

  // En edición se muestra la sede actual del reporte aunque no venga en el catálogo.
  const siteOptions = useMemo(() => {
    const currentSite = report?.site;
    if (!currentSite || sites.some((site) => site.site_id === currentSite.site_id)) return sites;
    return [currentSite, ...sites];
  }, [sites, report]);

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // "Especifica el tipo" solo aplica a «Otro».
      if (name === 'reportType' && Number(value) !== REPORT_TYPES.OTHER) next.otherType = '';
      return next;
    });

    if (validationError) setValidationError('');
    if (saveError) resetSave();
  }, [validationError, saveError, resetSave]);

  const handleCancel = () => {
    navigate(isEdit ? ROUTES.USER.REPORT_DETAIL(reportId) : ROUTES.USER.REPORTS_LIST);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = cleanFormData(formData);
    const reportType = Number(cleanedData.reportType);
    const isOther = reportType === REPORT_TYPES.OTHER;

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.dateReport) errors.push('La fecha es obligatoria.');
    else if (cleanedData.dateReport > todayISO()) errors.push('La fecha no puede ser posterior a hoy.');
    if (!REPORT_TYPE_LABELS[reportType]) errors.push('El tipo de reporte es obligatorio.');
    if (isOther && !cleanedData.otherType) errors.push('Especifica el tipo de reporte.');
    if (isOther && cleanedData.otherType.length > OTHER_TYPE_MAX_LENGTH) {
      errors.push(`El tipo de reporte admite como máximo ${OTHER_TYPE_MAX_LENGTH} caracteres.`);
    }
    if (!cleanedData.siteId) errors.push('La sede es obligatoria.');
    if (!cleanedData.description) errors.push('La descripción es obligatoria.');
    if (cleanedData.evidenceUrl && !isHttpUrl(cleanedData.evidenceUrl)) {
      errors.push('La evidencia debe ser un enlace que empiece con http:// o https://.');
    }
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    // El expediente y el internado los toma el backend de la sesión: no se envían.
    const payload = {
      site_id: Number(cleanedData.siteId),
      date_report: cleanedData.dateReport,
      report_type: reportType,
      other_type: isOther ? cleanedData.otherType : null,
      description: cleanedData.description,
      evidence_url: cleanedData.evidenceUrl || null,
      anonymity: cleanedData.anonymity,
    };

    if (isEdit) {
      const response = await updateReport(reportId, payload);
      if (response) navigate(ROUTES.USER.REPORT_DETAIL(reportId));
      return;
    }

    const response = await createReport(payload);
    if (response?.data?.report_id) {
      setCreatedId(response.data.report_id);
      setFormData({ ...INITIAL_FORM, siteId: defaultSiteId, dateReport: todayISO() });
    }
  };

// ---------------------- EFFECTS ----------------------

  // Edición: se carga el reporte en el formulario.
  useEffect(() => {
    if (report) setFormData(toFormData(report));
  }, [report]);

  // Creación: se preselecciona la sede en curso si el estudiante aún no eligió una.
  useEffect(() => {
    if (!defaultSiteId) return;
    setFormData((prev) => (prev.siteId ? prev : { ...prev, siteId: defaultSiteId }));
  }, [defaultSiteId]);

  // El aviso de "reporte registrado" se oculta solo después de 10 segundos.
  useEffect(() => {
    if (!created) return;
    const alertTimeout = setTimeout(resetCreate, 10000);
    return () => clearTimeout(alertTimeout);
  }, [created, resetCreate]);

// ---------------------- LOADING & ERROR STATES ----------------------

  if (isEdit) {
    if (fetching) return <LoadingSpinner />;

    if (fetchError) {
      return (
        <DataLoadError
          title="No se pudo cargar la información"
          message={fetchError}
          onRetry={refetch}
          onSecondary={() => navigate(ROUTES.USER.REPORTS_LIST)}
          secondaryLabel="Ir a mis reportes"
        />
      );
    }

    if (!report) {
      return (
        <DataLoadError
          title="404"
          message="No encontramos información de este reporte."
          onRetry={refetch}
          retryLabel="Recargar"
          onSecondary={() => navigate(ROUTES.USER.REPORTS_LIST)}
          secondaryLabel="Ir a mis reportes"
        />
      );
    }

    if (!report.is_open) {
      return (
        <div className="info-container">
          <div className="alert-error">
            El reporte está cerrado y ya no se puede editar.
          </div>
          <div className="button-group">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(ROUTES.USER.REPORT_DETAIL(reportId))}
            >
              Ver reporte
            </button>
          </div>
        </div>
      );
    }
  }

// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {created && (
        <div className="alert-success">
          Reporte registrado exitosamente.{' '}
          {createdId && (
            <Link
              to={ROUTES.USER.REPORT_DETAIL(createdId)}
              className="font-bold underline"
            >
              Ver
            </Link>
          )}
        </div>
      )}

      {(validationError || saveError) && (
        <div className="alert-error">
          <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {validationError || saveError}
            </span>
        </div>
      )}

      <div className="info-container">
        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header"><label htmlFor="report-date-report">Fecha *</label></dt>
              <dd className="item-text">
                <input
                  id="report-date-report"
                  name="dateReport"
                  type="date"
                  value={formData.dateReport}
                  onChange={handleChange}
                  max={todayISO()}
                  className="form-input--half"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="report-report-type">Tipo de reporte *</label></dt>
              <dd className="item-text">
                <select
                  id="report-report-type"
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={saving}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
            {isOtherType && (
              <div className="item-row">
                <dt className="item-header"><label htmlFor="report-other-type">Especifica el tipo *</label></dt>
                <dd className="item-text">
                  <input
                    id="report-other-type"
                    name="otherType"
                    type="text"
                    value={formData.otherType}
                    onChange={handleChange}
                    maxLength={OTHER_TYPE_MAX_LENGTH}
                    className="form-input--half"
                    placeholder={`Máximo ${OTHER_TYPE_MAX_LENGTH} caracteres`}
                    disabled={saving}
                    required
                  />
                </dd>
              </div>
            )}
            <div className="item-row">
              <dt className="item-header"><label htmlFor="report-site-id">Sede *</label></dt>
              <dd className="item-text">
                <select
                  id="report-site-id"
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={saving || fetchingSites}
                  required
                >
                  <option value="">
                    {fetchingSites ? 'Cargando sedes...' : 'Selecciona una sede'}
                  </option>
                  {siteOptions.map((site) => (
                    <option key={site.site_id} value={String(site.site_id)}>
                      {site.city ? `${site.name} (${site.city})` : site.name}
                    </option>
                  ))}
                </select>
                {sitesError && (
                  <p className="mt-1 text-xs text-red-600">
                    {sitesError}{' '}
                    <button type="button" className="underline" onClick={refetchSites}>
                      Reintentar
                    </button>
                  </p>
                )}
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="report-description">Descripción *</label></dt>
              <dd className="item-text">
                <textarea
                  id="report-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Brinda detalles sobre lo sucedido."
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="report-evidence-url">Evidencia (opcional)</label></dt>
              <dd className="item-text">
                <input
                  id="report-evidence-url"
                  name="evidenceUrl"
                  type="url"
                  value={formData.evidenceUrl}
                  onChange={handleChange}
                  maxLength={EVIDENCE_URL_MAX_LENGTH}
                  className="form-input--half"
                  placeholder="https://..."
                  disabled={saving}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enlace a fotos, videos u otros documentos que sirvan de evidencia.
                </p>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header"><label htmlFor="report-anonymity">¿Deseas que el reporte sea anónimo?</label></dt>
              <dd className="item-text">
                <input
                  id="report-anonymity"
                  name="anonymity"
                  type="checkbox"
                  checked={formData.anonymity}
                  onChange={handleChange}
                  className="form-checkbox"
                  disabled={saving}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Si lo marcas, la coordinación no verá tu nombre ni tu expediente en este reporte.
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ReportForm;
