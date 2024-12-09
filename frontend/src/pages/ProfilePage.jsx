import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import fetchUser from "../components/utils";
import ContenidoPrincipal from "../components/ContenidoPrincipal";
import BarraNavegacion from "../components/BarraNavegacion";


function ProfilePage() {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      name: user.name,
      pat_last_name: user.pat_last_name,
      mat_last_name: user.mat_last_name,
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
      pat_last_name: formData.pat_last_name,
      mat_last_name: formData.mat_last_name,
    };

    try {
      const response = await api.put("/students/", student);
      console.log(response);
      navigate('/user');
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  return (
    <div>
      <BarraNavegacion/>
      <ContenidoPrincipal user={user}>
        <form onSubmit={handleSubmit}>
          <p>
            <label><b>Name: </b></label>
            <input name="name" type="text" value={formData.name} onChange={handleChange}/>
          </p>
          <p>
            <label><b>Paternal last name: </b></label>
            <input name="pat_last_name" type="text" value={formData.pat_last_name} onChange={handleChange}/>
          </p>
          <p>
            <label><b>Maternal last name: </b></label>
            <input name="mat_last_name" type="text" value={formData.mat_last_name} onChange={handleChange}/>
          </p>
          <button type="submit">Guardar</button>
        </form>
      </ContenidoPrincipal>
    </div>
  );
}

export default ProfilePage;