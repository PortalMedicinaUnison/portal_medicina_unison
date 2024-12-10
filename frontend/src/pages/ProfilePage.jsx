import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import fetchUser from "../components/utils";
import ContenidoPrincipal from "../components/ContenidoPrincipal";
import BarraNavegacion from "../components/BarraNavegacion";


function ProfilePage() {
  const [user, setUser] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    patLastName: '',
    matLastName: '',
    fileNumber: '',
    email: '',
    phoneNumber: '',
  });

  const [image, setImage] = useState();

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      name: user.name,
      patLastName: user.pat_last_name,
      matLastName: user.mat_last_name,
      fileNumber: user.file_number,
      email: user.email,
      // phoneNumber: user.phone_number,
    })
  }, [user]);

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("name:" + name + ", value: " + value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const student = {
      id: user.id,
      name: formData.name,
      pat_last_name: formData.patLastName,
      mat_last_name: formData.matLastName,
      file_number: formData.fileNumber,
      email: formData.email,
      // phone_umber: formData.phoneNumber,
    };

    try {
      const response = await api.put("/students/", student);
      console.log(response);
      navigate('/inicio');
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    
    const imageData = {
      student_id: user.id,
      image: image,
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

  const handleImageChange = async (e) => {
    e.preventDefault();
    
    const imageData = {
      student_id: user.id,
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
    <div>
      <BarraNavegacion/>
      <ContenidoPrincipal user={user}>
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
              <label><h3>Nombre: </h3></label>
              <input name="name" type="text" value={formData.name} onChange={handleChange}/>
            </p>
            <p>
              <label><h3>Apellido paterno: </h3></label>
              <input name="patLastName" type="text" value={formData.patLastName} onChange={handleChange}/>
            </p>
            <p>
              <label><h3>Apellido materno: </h3></label>
              <input name="matLastName" type="text" value={formData.matLastName} onChange={handleChange}/>
            </p>
            <p>
              <label><h3>Expediente: </h3></label>
              <input name="fileNumber" type="text" value={formData.fileNumber} onChange={handleChange}/>
            </p>
            <p>
              <label><h3>Correo: </h3></label>
              <input name="email" type="text" value={formData.email} onChange={handleChange}/>
            </p>
            {/* <p>
              <label><h3>Teléfono: </h3></label>
              <input name="phoneNumber" type="text" value={formData.phoneNumber} onChange={handleChange}/>
            </p> */}
            <button type="submit">Guardar</button>
          </form>
        </div>
      </ContenidoPrincipal>
    </div>
  );
}

export default ProfilePage;