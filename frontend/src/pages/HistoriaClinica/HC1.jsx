import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HistoriaClinica1() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',   
    marital_status: '',
    birth_place: '',
    residence_place: '',
    occupation: '',
    phone_number: '',
    study_date: '' 
  });

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/historiaclinica2');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Historia Clínica</h1>
        <form className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">I. Ficha de Identificación</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                Edad:
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                Género:
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </label>
              <label className="block">
                Estado civil:
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  <option value="Soltero">Soltero(a)</option>
                  <option value="Casado">Casado(a)</option>
                  <option value="Union libre">Unión libre</option>
                  <option value="Viudo">Viudo(a)</option>
                </select>
              </label>
              <label className="block">
                Lugar de nacimiento:
                <input
                  type="text"
                  name="birth_place"
                  value={formData.birth_place}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                Lugar de residencia:
                <input
                  type="text"
                  name="residence_place"
                  value={formData.residence_place}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                Ocupación:
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                Teléfono:
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
            </div>
          </div>
      
          {/* Botón de Siguiente */}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HistoriaClinica1;
