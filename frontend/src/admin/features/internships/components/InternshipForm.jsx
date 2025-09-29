import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import useCreateInternship from '../hooks/useCreateInternship';
import { cleanFormData } from "../../../../utils/utils";


const INITIAL_FORM = {
  promotionId: '',
  studentId: '',
  siteId: '',
  status: '',
};

function InternshipForm() {
  const navigate = useNavigate();
  const { createInternship, loading: saving, success: saved, error: saveError, reset } = useCreateInternship();

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
      promotionId: Number(formData.promotionId),
      applicationId: Number(formData.applicationId),
      studentId: Number(formData.studentId),
      siteId: Number(formData.siteId),
      status: Number(formData.status),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      promotion_id: cleanedData.promotionId,
      application_id: cleanedData.applicationId,
      student_id: cleanedData.studentId,
      site_id: cleanedData.siteId,
      status: cleanedData.status,
    };
    
    const response = await createInternship(payload);
    if (response && response.data.internship_id) {
      setCreatedId(response.data.internship_id);
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

// ---------------------- RENDER ----------------------

  return (
    <form className="component-container" onSubmit={handleSubmit}>
      {saved && (
        <div className="alert-success">
          Internado registrado exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.INTERNSHIP_DETAIL(createdId))}
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
              <dt className="item-header">Promoción</dt>
              <dd className="item-text">
                <select
                  name="promotionId"
                  type="text"
                  value={formData.promotionId}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Promoción del internado"
                  disabled={saving}
                  required
                >
                  <option value={0}>Seleccionar promoción</option>
                  <option value={1}>2023-I</option>
                  <option value={2}>2023-II</option>
                  <option value={3}>2024-I</option>
                </select>
              </dd>
            </div>
            <div className="item-row">
              <dt className="item-header">Sede</dt>
              <dd className="item-text">
                <select
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleChange}
                  rows="4"
                  className="form-input--half"
                  placeholder="Sede del internado"
                  disabled={saving}
                  required
                >
                  <option value={0}>Seleccionar sede</option>
                  <option value={1}>Lima</option>
                  <option value={2}>Arequipa</option>
                  <option value={3}>Trujillo</option>
                </select>
              </dd>
            </div>
            <div className="item-row">
                <dt className="item-header">Estatus</dt>
                <dd className="item-text">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-input--half"
                    disabled={saving}
                    required
                  >
                    <option value={0}>Seleccionar tipo</option>
                    <option value={1}>Pendiente</option>
                    <option value={2}>Aceptado</option>
                    <option value={3}>Rechazado</option>
                    <option value={4}>Suspendido</option>
                    <option value={5}>Finalizado</option>
                  </select>
                </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_LIST))}
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

export default InternshipForm;