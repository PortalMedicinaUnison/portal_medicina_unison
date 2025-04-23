import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';

function FormularioPerfil() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    second_last_name: user?.second_last_name || '',
    email: user?.email || '',
    academic_id: user?.academic_id || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los datos
    console.log("Datos actualizados:", formData);
  };

  return (
    <form className="user-info-list" onSubmit={handleSubmit}>
      <h1 className="page-title">Editar Perfil del Solicitante</h1>
      <div className="user-info-list">
        <div className="user-info-row">
          <label className="form-label" htmlFor="first_name">Nombre(s)</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="user-info-input"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="user-info-row">
          <label className="form-label" htmlFor="last_name">Apellido paterno</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="user-info-input"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="user-info-row">
          <label className="form-label" htmlFor="second_last_name">Apellido materno</label>
          <input
            type="text"
            id="second_last_name"
            name="second_last_name"
            className="user-info-input"
            value={formData.second_last_name}
            onChange={handleChange}
          />
        </div>

        <div className="user-info-row">
          <label className="form-label" htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className="user-info-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="user-info-row">
          <label className="form-label" htmlFor="academic_id">Número de expediente</label>
          <input
            type="text"
            id="academic_id"
            name="academic_id"
            className="user-info-input"
            value={formData.academic_id}
            onChange={handleChange}
          />
        </div>

        <div className="user-info-actions">
          <button type="submit" className="submit-button">Guardar cambios</button>
        </div>
      </div>
    </form>
  );
}

export default FormularioPerfil;
