import React, { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import useUserUpdate from '../hooks/useUserUpdate';

function FormularioPerfil() {
  const { user } = useUser();
  const { updateUser, error: updateError, success } = useUserUpdate();
  const navigate = useNavigate(); // Inicializa useNavigate

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    phone_number: '',
    password: '',
    profile_photo: '',
    is_admin: false,
    is_super_admin: false,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        secondLastName: user.second_last_name ?? "",
        email: user.email ?? "",
        phone_number: user.phone_number ?? "",
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

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError('Todos los campos obligatorios deben ser llenados.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El correo electrónico no es válido.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isUpdated = await updateUser(formData, user.user_id);
    if (isUpdated) {
      console.log('Actualización exitosa');
    }
  };

  return (
    <form className="user-info-card" onSubmit={handleSubmit}>
      <h1 className="page-title">Editar Información del Solicitante</h1>

      {success && (
        <div className="alert-success-text">
          Información actualizada exitosamente.
        </div>
      )}

      {error && (
        <div className="alert-footer-text">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="user-info-container">
        <div className="user-info-photo">
          <img 
            src={user?.profile_photo || "/default-avatar.png"} 
            alt="Foto de perfil" 
            className="user-profile-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
        </div>
        <div className="user-info-details">
          <dl className="user-info-list">
            <div className="user-info-row">
              <dt className="form-label">Nombre</dt>
              <dd className="user-info-data">
                <input
                  className="form-input_full"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </dd>
            </div>

            <div className="user-info-row">
              <dt className="form-label">Apellido Paterno</dt>
              <dd className="user-info-data">
                <input
                  className="form-input_full"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Apellido Paterno"
                />
              </dd>
            </div>

            <div className="user-info-row">
              <dt className="form-label">Apellido Materno</dt>
              <dd className="user-info-data">
                <input
                  className="form-input_full"
                  name="secondLastName"
                  type="text"
                  value={formData.secondLastName}
                  onChange={handleChange}
                  placeholder="Apellido Materno"
                />
              </dd>
            </div>

            <div className="user-info-row">
              <dt className="form-label">Correo Electrónico</dt>
              <dd className="user-info-data">
                <input
                  className="form-input_full"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo Electrónico"
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="button-group">
        <button 
          type="button" 
          className="btn-secondary" 
          onClick={() => navigate("/perfil")} // Redirige a la página de perfil
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  );
}

export default FormularioPerfil;
