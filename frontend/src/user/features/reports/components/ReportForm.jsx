import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateReport from '../hooks/useCreateReport';
import { cleanFormData } from "../../../../utils/utils";


const INITIAL_FORM = {
  internshipId: '',
  siteId: '',
  date: '',
  type: '',
  otherType: '',
  description: '',
  evidenceUrl: '',
  anonimity: false,
  isOpen: true,
};

function ReportForm() {
  const navigate = useNavigate();
  const { createReport, loading: saving, success: saved, error: saveError, reset } = useCreateReport();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [createdId, setCreatedId] = useState(null);
  const [validationError, setValidationError] = useState('');

// ---------------------- HANDLERS ----------------------

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (validationError) return setValidationError('');
    if (saveError) return reset();
            
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = cleanFormData({
      ...formData,
      internshipId: Number(formData.internshipId),
      siteId: Number(formData.siteId),
      type: Number(formData.type),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.date) errors.push('La fecha es obligatoria');
    if (!cleanedData.type) errors.push('El tipo de reporte es obligatorio');
    if (!cleanedData.description) errors.push('La descripción es obligatoria');
    if (!cleanedData.anonimity) errors.push('Debe declarar si desea o no ser anónimo');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      internship_id: cleanedData.internshipId,
      site_id: cleanedData.siteId,
      date: cleanedData.date,
      type: cleanedData.type,
      other_type: cleanedData.otherType,
      description: cleanedData.description,
      evidence_url: cleanedData.evidenceUrl,
      anonimity: cleanedData.anonimity,
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
                  name="date"
                  type="date"
                  value={formData.date}
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
                    name="type"
                    value={formData.type}
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
                    <option value={6}>Robo o hurto</option>
                    <option value={7}>Otro</option>
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
              <dt className="item-header">¿Reporte anonimo?</dt>
              <dd className="item-text">
                <input
                  name="anonimity"
                  type="checkbox"
                  checked={formData.anonimity}
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
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENTS_LIST))}
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