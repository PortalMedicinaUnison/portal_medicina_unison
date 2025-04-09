import React, { useState, useEffect } from "react";
import api from "../../../api";
import useUserProfile from "../../../hooks/useUserProfile";

function FormularioPerfil({ user }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    secondLastName: "",
    email: "",
  });

  const [userMetaData, setUserMetaData] = useState({
    profile_photo: "",
  });

  const userData = useUserProfile(user.user_id);
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.first_name ?? "",
        lastName: userData.last_name ?? "",
        secondLastName: userData.second_last_name ?? "",
        email: userData.email ?? "",
      });
      setUserMetaData({
        profile_photo: userData.profile_photo ?? "",
      });
    }
  }, [userData]);

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Por favor completa todos los campos requeridos.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor ingresa un correo electrónico válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await api.put(`/users/${user.user_id}`, {
        user_id: user.user_id,
        academic_id: String(user.academic_id),
        first_name: formData.firstName,
        last_name: formData.lastName,
        second_last_name: formData.secondLastName,
        email: formData.email,
        profile_photo: userMetaData.profile_photo,
      });
    } catch (error) {
      console.error("Error al actualizar el perfil", error);
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
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="form-label">Apellido Paterno</label>
          <input
            className="form-input"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="form-label">Apellido Materno</label>
          <input
            className="form-input"
            name="secondLastName"
            type="text"
            value={formData.secondLastName}
            onChange={(e) => setFormData({ ...formData, secondLastName: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="form-label">Correo Electrónico</label>
          <input
            className="form-input"
            name="email"
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Mueve los botones aquí */}
        <div className="button-group">
          <button type="button" className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary">Guardar</button>
        </div>
      </div>
    </form>
  );
}

export default FormularioPerfil;
