import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import useCreateEnrollment from "../hooks/useCreateEnrollment";

function EnrollmentForm() {
  const navigate = useNavigate();
  const { createEnrollment, error, success } = useCreateEnrollment();

  const [formData, setFormData] = useState({
    student_id: '',
    is_accepted: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCreated = await createEnrollment(formData);
    if (isCreated) {
      console.log('Alumno pre-registrado exitosamente');
      
      setFormData({
        student_id: '',
        is_accepted: false,
      });
    }
  };

  return (
    <form className="component-container" onSubmit={handleSubmit}>

      {success && (
        <div className="alert-success-text">
          Alumno pre-registrado exitosamente.
        </div>
      )}

      {error && (
        <div className="alert-footer-text">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="info-container">
        
        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">Expediente del alumno</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="student_id"
                  type="text"
                  value={formData.student_id}
                  onChange={handleChange}
                  placeholder="Expediente del alumno"
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
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.ENROLLMENT_LIST))}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
}

export default EnrollmentForm;