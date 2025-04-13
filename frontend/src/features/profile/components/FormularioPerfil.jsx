import React, { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import useUserUpdate from '../hooks/useUserUpdate';

function FormularioPerfil() {
  const { user } = useUser();
  const { updateUser, error, success } = useUserUpdate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    password: '',
    profile_photo: '',
    is_admin: false,
    is_super_admin: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        secondLastName: user.second_last_name ?? "",
        email: user.email ?? "",
        password: user.password ?? "",
        profile_photo: user.profile_photo ?? "",
        is_admin: user.is_admin ?? false,
        is_super_admin: user.is_super_admin ?? false,
      });
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUpdated = await updateUser(formData, user.user_id);
    if (isUpdated) {
      console.log('Actualización exitosa');

      setFormData({
        firstName: '',
        lastName: '',
        secondLastName: '',
        email: '',
        password: '',
        profile_photo: '',
        is_admin: false,
        is_super_admin: false
      });
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="profile-section">
        <label htmlFor="file-upload" className="profile-label">
          <img
            src={`/default-avatar.png`} // Cambiar después que tengamos el endpoint
            alt="User Profile"
            className="profile-image"
          />
        </label>
      </div>
      
      <div className="form-grid single-column">
        <div className="input-group">
          <label className="form-label">Nombre</label>
          <input
            className="form-input"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="form-label">Apellido Paterno</label>
          <input
            className="form-input"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="form-label">Apellido Materno</label>
          <input
            className="form-input"
            name="secondLastName"
            type="text"
            value={formData.secondLastName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="form-label">Correo Electrónico</label>
          <input
            className="form-input"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button type="button" className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary">Guardar</button>
        </div>
      </div>
    </form>
  );
}

export default FormularioPerfil;
