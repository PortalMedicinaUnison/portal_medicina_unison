import React from "react";
import { useEffect, useState } from "react";
import api from "../api";

function FormularioPerfil({user}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    secondLastName: '',
    academicId: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    setFormData({
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      secondLastName: user.second_last_name ?? "",
      academicId: user.academic_id ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    })
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedUser = {
      id: user.id,
      first_name: formData.firstName,
      paternal_last_name: formData.lastName,
      second_last_name: formData.secondLastName,
      academic_id: formData.academicId,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      const response = await api.put(`/users/${user.id}`, updatedUser);
      console.log(response);
      window.location.reload();
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

    try {
      const response = await api.put("/profile_picture/", imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error("Edit failed", error);
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
            <img src={`/profile_images/${user.profile_image_path}`} alt="User Photo" />
            <input id="file-upload" type="file" onChange={handleImageChange}/>
        </label>
        </div>
        <form onSubmit={handleSubmit}>
        <p>
            <label><span>Nombre: </span></label>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}/>
        </p>
        <p>
            <label><span>Apellido paterno: </span></label>
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}/>
        </p>
        <p>
            <label><span>Apellido materno: </span></label>
            <input
              name="secondLastName"
              type="text"
              value={formData.secondLastName}
              onChange={handleChange}/>
        </p>
        <p>
            <label><span>Expediente: </span></label>
            <input
              name="academicId"
              type="text"
              value={formData.academicId}
              onChange={handleChange}
            />
        </p>
        <p>
            <label><span>Correo: </span></label>
            <input 
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
            />
        </p>
        {/* <p>
          <label><span>Teléfono: </span></label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
          />
        </p> */}
        <button type="submit">Guardar</button>
        </form>
    </div>
  );
}

export default FormularioPerfil;