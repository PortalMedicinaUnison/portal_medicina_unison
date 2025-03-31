import React, { useState, useEffect } from "react";
import api from "../../../api";
import useUserProfile from "../../../hooks/useUserProfile";

function FormularioPerfil({ user }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    password: '',
  });

  const [userMetaData, setUserMetaData] = useState({
    profile_photo: '',
    is_admin: false,
    is_super_admin: false,
  });

  const [uploadStatus, setUploadStatus] = useState(null);

  const userData = useUserProfile(user.user_id);
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.first_name ?? "",
        lastName: userData.last_name ?? "",
        secondLastName: userData.second_last_name ?? "",
        email: userData.email ?? "",
        password: userData.password ?? "",
      });
      setUserMetaData({
        profile_photo: userData.profile_photo ?? "",
        is_admin: userData.is_admin ?? false,
        is_super_admin: userData.is_super_admin ?? false,
      });
    }
  }, [userData]);

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Por favor completa todos los campos requeridos.");
      return false;
    }
    // Validar correo electrónico simple
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

    const updatedUser = {
      user_id: user.user_id,
      academic_id: String(user.academic_id),
      first_name: formData.firstName,
      last_name: formData.lastName,
      second_last_name: formData.secondLastName,
      email: formData.email,
      profile_photo: userMetaData.profile_photo,
      is_admin: userMetaData.is_admin,
      is_super_admin: userMetaData.is_super_admin,
    };

    try {
      const response = await api.put(`/users/${user.user_id}`, updatedUser);
      console.log(response);
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  const handleImageChange = async (e) => {
    e.preventDefault();
    const imageData = {
      user_id: user.id,
      image: e.target.files[0],
    };

    setUploadStatus("Cargando...");

    try {
      const response = await api.put("/profile_picture/", imageData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      setUploadStatus("Imagen cargada con éxito.");
      // Actualiza el estado global si es necesario
    } catch (error) {
      console.error("Edit failed", error);
      setUploadStatus("Error al cargar la imagen.");
    }
  };

  return (
    <div className="profile-page">
      <h1>Perfil</h1>
      <div className="user-profile-picture">
        <label htmlFor="file-upload">
          <div className="hover-text">
            <p>Editar</p>
          </div>
          <img src={`/profile_images/${userMetaData.profile_photo}`} alt="User Photo" />
          <input id="file-upload" type="file" onChange={handleImageChange} />
        </label>
      </div>

      {uploadStatus && <div>{uploadStatus}</div>}

      <form onSubmit={handleSubmit}>
        <p>
          <label><span>Nombre: </span></label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </p>
        <p>
          <label><span>Apellido paterno: </span></label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </p>
        <p>
          <label><span>Apellido materno: </span></label>
          <input
            name="secondLastName"
            type="text"
            value={formData.secondLastName}
            onChange={(e) => setFormData({ ...formData, secondLastName: e.target.value })}
          />
        </p>
        <p>
          <label><span>Correo: </span></label>
          <input
            name="email"
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </p>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default FormularioPerfil;
