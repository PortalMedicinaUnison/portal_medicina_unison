import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HistoriaClinica2() {
  const [formData, setFormData] = useState({
    
    antecedentes_hereditarios: {
      alcoholismo: false,
      artritis: false,
      cancer: false,
      cardiopatias: false,
      depresion: false,
      diabetes: false,
      obesidad: false,
      presion_arterial: false,
      tabaquismo: false,
    }

  });

  const [selected, setSelected] = useState(
    ['Alcoholismo', 'Artritis', 'Cáncer', 'Cardiopatías', 'Depresión', 'Diabetes Mellitus Tipo I, II', 'Obesidad', 'Presión Arterial Alta', 'Tabaquismo'].map(() => ({
      padre: false,
      madre: false,
      hermanos: false,
      ninguno: false,
      noSe: false,
    }))
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCheckboxChange = (conditionIndex, field) => {
    setSelected((prevSelected) =>
      prevSelected.map((item, index) => {
        if (index === conditionIndex) {
          if (field === 'ninguno' || field === 'noSe') {
            return { padre: false, madre: false, hermanos: false, ninguno: field === 'ninguno', noSe: field === 'noSe' };
          } else {
            return { ...item, [field]: !item[field], ninguno: false, noSe: false };
          }
        }
        return item;
      })
    );
  };

  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/historiaclinica3');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Historia Clínica</h1>
        <form className="space-y-4">
          {/* Tabla de Antecedentes Hereditarios y Familiares */}
          <div>
            <h2 className="text-xl font-semibold mb-4">II. Antecedentes Hereditarios y Familiares</h2>
            <div className="flex justify-center">
              <table className="table-auto border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Antecedentes Hereditarios y Familiares</th>
                    <th className="border border-gray-300 px-4 py-2">Padre</th>
                    <th className="border border-gray-300 px-4 py-2">Madre</th>
                    <th className="border border-gray-300 px-4 py-2">Hermanos</th>
                    <th className="border border-gray-300 px-4 py-2">Ninguno</th>
                    <th className="border border-gray-300 px-4 py-2">No sé</th>
                  </tr>
                </thead>
                <tbody>
                  {['Alcoholismo', 'Artritis', 'Cáncer', 'Cardiopatías', 'Depresión', 'Diabetes Mellitus Tipo I, II', 'Obesidad', 'Presión Arterial Alta', 'Tabaquismo'].map(
                    (condition, conditionIndex) => (
                      <tr key={conditionIndex}>
                        <td className="border border-gray-300 px-4 py-2">{condition}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected[conditionIndex].padre}
                            onChange={() => handleCheckboxChange(conditionIndex, 'padre')}
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected[conditionIndex].madre}
                            onChange={() => handleCheckboxChange(conditionIndex, 'madre')}
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected[conditionIndex].hermanos}
                            onChange={() => handleCheckboxChange(conditionIndex, 'hermanos')}
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected[conditionIndex].ninguno}
                            onChange={() => handleCheckboxChange(conditionIndex, 'ninguno')}
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected[conditionIndex].noSe}
                            onChange={() => handleCheckboxChange(conditionIndex, 'noSe')}
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
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

export default HistoriaClinica2;
