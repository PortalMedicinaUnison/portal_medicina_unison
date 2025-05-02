import React, { useState } from 'react';
import api from "../../../../../api";

function SeccionUno({user, formData, setFormData}) {

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      section_one: {
        ...formData.section_one,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    
    // const medicalRecord = {
    //   id: user.id,
    //   name: formData.section_one.name,
    //   pat_last_name: formData.section_one.pat_last_name,
    //   mat_last_name: formData.section_one.mat_last_name,
    //   age: formData.section_one.age,
    //   sex: formData.section_one.sex,
    //   gender: formData.section_one.gender,
    //   marital_status: formData.section_one.marital_status,
    //   birth_place: formData.section_one.birth_place,
    //   residence_place: formData.section_one.residence_place,
    //   occupation: formData.section_one.occupation,
    //   phone_number: formData.section_one.phone_number,
    //   study_date: formData.section_one.study_date,
    // };

    // console.log(medicalRecord);

    // try {
    //   const response = await api.put("/medical_record/", medicalRecord);
    //   console.log(response);
    //   window.location.reload();
    // } catch (error) {
    //   console.error("Edit failed", error);
    // }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div> */}
          <h2 className="text-xl font-semibold mb-4">I. Ficha de Identificación</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Nombre:
              <input
                type="text"
                name="name"
                value={formData.section_one.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Apellido paterno:
              <input
                type="text"
                name="pat_last_name"
                value={formData.section_one.pat_last_name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Apellido materno:
              <input
                type="text"
                name="mat_last_name"
                value={formData.section_one.mat_last_name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
            Edad:
            <input
              type="number"
              name="age"
              value={formData.section_one.age}
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
                value={formData.section_one.gender}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </label>
            <label className="block">
              Sexo:
              <select
                name="sex"
                value={formData.section_one.sex}
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
                value={formData.section_one.marital_status}
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
                value={formData.section_one.birth_place}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Lugar de residencia:
              <input
                type="text"
                name="residence_place"
                value={formData.section_one.residence_place}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Ocupación:
              <input
                type="text"
                name="occupation"
                value={formData.section_one.occupation}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Teléfono:
              <input
                type="text"
                name="phone_number"
                value={formData.section_one.phone_number}
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
            <label className="block">
              Fecha de estudio:
              <input
                type="date"
                name="study_date"
                value={formData.section_one.study_date}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
          </div>
        {/* </div> */}
      </form>
    </div>
  );
}

export default SeccionUno;
