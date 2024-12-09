import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SeccionUno() {
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
    navigate('/SeccionDos');
  };

  return (
    <div>
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
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 2) {
                  handleChange(e);
                }
              }}
              onInput={(e) => {
                if (e.target.value.length > 2) {
                  e.target.value = e.target.value.slice(0, 2);
                }
              }}
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
                onChange={(e) => {
                  const value = e.target.value;
                  // Permitir solo números y limitar a 10 dígitos
                  if (/^\d{0,10}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                onInput={(e) => {
                  // Cortar cualquier entrada extra después de 10 dígitos
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="Ingresa tu teléfono (10 dígitos)"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SeccionUno;
