import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../../config';
import useCreateEnrollment from '../hooks/useCreateEnrollment';
import { cleanFormData } from "../../../../../utils/utils";


const INITIAL_FORM = {
  academicId: '',
};

function EnrollmentForm() {
  const navigate = useNavigate();
  const { createEnrollment, loading: saving, success: saved, error: saveError, reset } = useCreateEnrollment();

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
      academicId: Number(formData.academicId),
    });

    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.academicId) errors.push('El expediente académico es obligatorio');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      academic_id: cleanedData.academicId,
    };
    
    const response = await createEnrollment(payload);
    if (response && response.data.enrollment_id) {
      setCreatedId(response.data.enrollment_id);
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
          Anuncio registrado exitosamente.{' '}
          {createdId && (
            <Link
              to={adminAbs(ROUTES.ADMIN.USER_ENROLLMENT_DETAIL(createdId))}
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
              <dt className="item-header">Expediente del alumno</dt>
              <dd className="item-text">
                <input
                  name="academicId"
                  type="text"
                  value={formData.academicId}
                  onChange={handleChange}
                  className="form-input--half"
                  placeholder="Expediente del alumno"
                  disabled={saving}
                  required
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="info-actions mt-16">
          <button 
              type="button" 
              className='item-link'
          >
              Importar desde csv
          </button>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.USER_ENROLLMENT_LIST))}
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

export default EnrollmentForm;