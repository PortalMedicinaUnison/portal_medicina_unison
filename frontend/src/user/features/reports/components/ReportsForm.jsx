import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../../api';

function ReportsForm() {
  const [formData, setFormData] = useState({
      date: '',
      place: '',
      type: '',
      otherType: '',
      description: '',
      implicated: '',
      evidence: '',
      anonymity: '',
      acceptContact: '',
      affected: '',
      confidentiality: '',
      contact: '',
    });

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

    const formData = {
      username: email,
      password: password,
      role: "student"
    };

    try {
      const response = await api.post('/token/', formData);
      sessionStorage.setItem("access_token", response.data.access_token);
      navigate('/inicio');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white p-8 shadow-md rounded">
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Fecha y hora del incidente:</label>
                    <input
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Lugar del incidente:</label>
                    <input
                    type="text"
                    value={formData.place}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de incidente:</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                    >
                        <option value="labour_harassment">Acoso laboral</option>
                        <option value="sexual_harassment">Acoso sexual</option>
                        <option value="workplace_accident">Accidente laboral</option>
                        <option value="protocol_violation">Violación de protocolos</option>
                        <option value="discrimination">Discriminación</option>
                        <option value="incidenttypeother">Otro</option>
                    </select>
                </div>
                {formData.type === "incidenttypeother" && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Otro tipo:</label>
                        <input
                        type="text"
                        value={formData.otherType}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                    <textarea
                        type="text"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">¿Hubo terceros involucrados?</label>
                    <div className="flex space-x-4">
                        <label><input type="radio" value="completo" onChange={handleChange} />Sí</label>
                        <label><input type="radio" value="incompleto" onChange={handleChange} />No</label>
                    </div>
                    <input
                    type="checkbox"
                    value={formData.implicated}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Adjuntar evidencia (fotos, videos, audios, documentos):</label>
                    <input
                    type="file"
                    value={formData.evidence}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">¿Prefieres que tu reporte sea anónimo?</label>
                    <input
                    type="checkbox"
                    value={formData.anonymity}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del afectado:</label>
                    <input
                    type="text"
                    value={formData.affected}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">¿Puedes ser contactado para obtener más información?</label>
                    <input
                    type="checkbox"
                    value={formData.acceptContact}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
                    <input
                    type="email"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Declaro que toda la información proporcionada es veridica. Además
        soy conciente que la información proporcionada es confidencial y solamente será compartida
        con el personal autorizado”</label>
                <input
                type="checkbox"
                value={formData.type}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        </form>
    </div>
  );
}

export default ReportsForm;




// CREATE TABLE reporte (
//     id_incidente integer NOT NULL PRIMARY KEY,
//     fecha_incidente date NOT NULL,
//     lugar text NOT NULL,
//     tipo text NOT NULL,
//     tipo_otro text,
//     descripción text NOT NULL,
//     involucrados boolean NOT NULL,
//     evidencia text,
//     anonimato boolean NOT NULL,
//     nombre_afectado text,
//     aceptar_contacto boolean NOT NULL,
//     confidencialidad boolean NOT NULL,
//     contacto_correo text
//   );