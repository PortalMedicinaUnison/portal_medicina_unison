import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateReport from '../hooks/useCreateReport';
import useGetSites from '../../../../admin/features/sites/hooks/useGetSites';
import { cleanFormData } from "../../../../utils/utils";
import { useUser } from '../../../../contexts/UserContext';


const INITIAL_FORM = {
  siteId: '',
  internshipId: '',
  dateReport: '',
  reportType: '',
  otherType: '',
  description: '',
  evidenceUrl: '',
  anonymity: false,
  isOpen: true,
};

function ReportForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { createReport, loading: saving, success: saved, error: saveError, reset } = useCreateReport();
  const { sites, loading: fetchingSites, error: sitesError } = useGetSites();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [createdId, setCreatedId] = useState(null);
  const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Limpiar otherType cuando se cambia de "Otro" a otra opción
      if (name === 'reportType' && String(value) !== '7') next.otherType = '';
      return next;
    });

    if (validationError) return setValidationError('');
    if (saveError) return reset();
            
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = cleanFormData({
      ...formData,
      academicId: user.academic_id,
      internshipId: Number(user.internship_id),
      siteId: Number(formData.siteId),
      reportType: Number(formData.reportType),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.dateReport) errors.push('La fecha es obligatoria');
    if (!cleanedData.siteId) errors.push('La sede es obligatoria');
    if (!cleanedData.reportType) errors.push('El tipo de reporte es obligatorio');
    if (!cleanedData.description) errors.push('La descripción es obligatoria');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      academic_id: cleanedData.academicId,
      internship_id: cleanedData.internshipId,
      site_id: cleanedData.siteId,
      date_report: cleanedData.dateReport,
      report_type: cleanedData.reportType,
      other_type: Number(cleanedData.reportType) === 7 ? cleanedData.otherType : null,
      description: cleanedData.description,
      evidence_url: cleanedData.evidenceUrl,
      anonymity: cleanedData.anonymity,
      is_open: cleanedData.isOpen,
    };
    
    const response = await createReport(payload);
    if (response && response.data.report_id) {
      setCreatedId(response.data.report_id);
    }
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (saved) {
      setFormData(INITIAL_FORM);

      const alertTimeout = setTimeout(() => {
        reset();
      }, 10000);
      return () => clearTimeout(alertTimeout);
    }
  }, [saved, reset]);

// ---------------------- LOADING & ERROR STATES ----------------------

    
// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {saved && (
        <div className="alert-success">
          Reporte registrado exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.REPORT_DETAIL(createdId))}
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
              <dt className="item-header">Fecha</dt>
              <dd className="item-text">
                <input
                  name="dateReport"
                  type="date"
                  value={formData.dateReport}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="dd/mm/aaaa"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
                <dt className="item-header">Motivo</dt>
                <dd className="item-text">
                  <select
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleChange}
                    className="form-input--half"
                    disabled={saving}
                    required
                  >
                    <option value={0}>Seleccionar tipo</option>
                    <option value={1}>Accidente</option>
                    <option value={2}>Condiciones inseguras</option>
                    <option value={3}>Acoso laboral</option>
                    <option value={4}>Acoso sexual</option>
                    <option value={5}>Discriminación</option>
                    <option value={6}>Robo</option>
                    <option value={7}>Otro</option>
                  </select>
                </dd>
            </div>
            {Number(formData.reportType) === 7 && (
              <div className="item-row">
                <dt className="item-header">Especificar motivo</dt>
                <dd className="item-text">
                  <input
                    name="otherType"
                    type="text"
                    value={formData.otherType}
                    onChange={handleChange}
                    className="form-input--half"
                    placeholder="Describe el motivo del reporte"
                    disabled={saving}
                    required
                  />
                </dd>
              </div>
            )}
            <div className="item-row">
              <dt className="item-header">Sede *</dt>
              <dd className="item-text">
                <select
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleChange}
                  className="form-input--half"
                  disabled={fetchingSites || saving || sitesError}
                  required
                >
                  <option value="">Selecciona una sede</option>
                  {sites.map(site => (
                    <option key={site.site_id} value={site.site_id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Descripción</dt>
              <dd className="item-text">
                <textarea
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
              <dt className="item-header">Evidencia</dt>
              <dd className="item-text">
                <input
                  name="evidenceUrl"
                  value={formData.evidenceUrl}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Adjunta un enlace a fotos, videos u otros documentos que sirvan de evidencia."
                  disabled={saving}
                  required
                />
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">¿Deseas que el reporte sea anonimo?</dt>
              <dd className="item-text">
                <input
                  name="anonymity"
                  type="checkbox"
                  checked={formData.anonymity}
                  onChange={handleChange}
                  className="form-checkbox"
                  disabled={saving}
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(adminAbs(ROUTES.HOME))}
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