import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateInstituion from "../hooks/useCreateInstitution";
import { ROUTES, adminAbs } from "../../../../config";

function InstitutionForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
  });

  const { createInstitution, error, success } = useCreateInstituion();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCreated = await createInstitution(formData);
    if (isCreated) {
      console.log('Institución registrada exitosamente');
      
      setFormData({
        name: '',
      });
    }
  };

  return (
    <form className="component-container" onSubmit={handleSubmit}>

      {success && (
        <div className="alert-success-text">
          Institución registrada exitosamente.
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
              <dt className="item-header">Razon social</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Razon social"
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(adminAbs(ROUTES.ADMIN.INSTITUTION_LIST))}
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

export default InstitutionForm;
