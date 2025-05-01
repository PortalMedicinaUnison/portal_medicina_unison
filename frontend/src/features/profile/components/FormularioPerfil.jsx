import React, { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import useUserUpdate from '../hooks/useUserUpdate';

function FormularioPerfil() {
  const { user } = useUser();
  const { updateUser, error: updateError, success } = useUserUpdate();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    phoneNumber: '',
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
        phoneNumber: user.phone_number ?? "",
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
    <form className="component-container" onSubmit={handleSubmit}>

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

      <div className="component-container_header">
        <div className="component-container_header-content">
          <div className="component-container_pretitle">
            <p>Inicio</p>
          </div>
          <h2 className="page-title-1">
            Editar perfil
          </h2>
        </div>
      </div>

      <div className="info-container">
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

          <div class="info-actions">
            <p className='item-link'>Cambiar foto</p>
            <p className='item-text'>Esto ayudará a tu administrador a identificarte</p>
          </div>
        </div>

        <div className="item-container">
          <dl className="item-list">
            <div className="item-row">
              <dt className="item-header">Nombre</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Apellido Paterno</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Apellido Paterno"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Apellido Materno</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
                  name="secondLastName"
                  type="text"
                  value={formData.secondLastName}
                  onChange={handleChange}
                  placeholder="Apellido Materno"
                />
              </dd>
            </div>

            <div className="item-row">
              <dt className="item-header">Correo Electrónico</dt>
              <dd className="item-text">
                <input
                  className="form-input--half"
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

        <div class="info-actions">
          <button type="button" className='item-link'>Reset Password</button>
          <button type="button" className='item-link'>Remove account</button>
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
      </div>
    </form>
  );
}

export default FormularioPerfil;
