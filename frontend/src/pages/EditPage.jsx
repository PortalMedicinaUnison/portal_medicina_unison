import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import fetchUser from "../components/utils";


function EditPage() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  
  const [name, setName] = useState('aaa');
  const [patLastName, setPatLastName] = useState('bbb');
  const [matLastName, setMatLastName] = useState('ccc');
  const [fileNumber, setFileNumber] = useState(0);
  
  useEffect(() => {
    const updateUser = async() => {
      await fetchUser(setUser);
    };

    updateUser();
  }, []);
  
  useEffect(() => {
    setName(user.name);
    setPatLastName(user.pat_last_name);
    setMatLastName(user.mat_last_name);
    setFileNumber(user.file_number);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // navigate('/user');
    const formData = {
      id: user.id,
      name: name,
      pat_last_name: patLastName,
      mat_last_name: matLastName,
      file_number: fileNumber
    };

    try {
      const response = await api.put("/students/", formData);
      console.log(response);
      navigate('/user');
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <p>
        <label><b>Name: </b></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      </p>
      <p>
        <label><b>Paternal last name: </b></label>
        <input type="text" value={patLastName} onChange={(e) => setPatLastName(e.target.value)}/>
      </p>
      <p>
        <label><b>Maternal last name: </b></label>
        <input type="text" value={matLastName} onChange={(e) => setMatLastName(e.target.value)}/>
      </p>
      <p>
        <label><b>File number: </b></label>
        <input type="text" value={fileNumber} onChange={(e) => setFileNumber(e.target.value)}/>
      </p>
      <button type="submit">Edit</button>
    </form>
    <p>{user.name}</p>
    </div>
  );
}

export default EditPage;