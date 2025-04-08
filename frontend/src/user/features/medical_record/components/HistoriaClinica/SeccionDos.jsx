import React, { useState } from 'react';

function SeccionDos() {
  const conditionLabels = [
    'Alcoholismo',
    'Artritis',
    'Cáncer',
    'Cardiopatías',
    'Depresión',
    'Diabetes Mellitus Tipo I, II',
    'Obesidad',
    'Presión Arterial Alta',
    'Tabaquismo'
  ];

  const conditions = [
    "alcoholism",
    "arthritis",
    "cancer",
    "heart_diseases",
    "depression",
    "diabetes",
    "obesity",
    "blood_pressure",
    "smoking"
  ];

  const [formData, setFormData] = useState(
    conditions.reduce((acc, condition) => {
      acc[condition] = {
        father: false,
        mother: false,
        siblings: false,
        none: false,
        unknown: false,
      };
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCheckboxChange = (condition, field) => {

    for (const key in formData) {
      if (key == condition) {
        if (field === 'none' || field === 'unknown') {
          setFormData({
              father: false,
              mother: false,
              siblings: false,
              none: field === 'none',
              unknown: field === 'unknown'
            });
        } else {
          return { ...item, [field]: !item[field], none: false, unknown: false };
        }
      }
    }

    setFormData((prevSelected) =>
      prevSelected.map((item, index) => {
        if (index === conditionIndex) {
          if (field === 'none' || field === 'unknown') {
            return { father: false, mother: false, siblings: false, none: field === 'none', unknown: field === 'unknown' };
          } else {
            return { ...item, [field]: !item[field], none: false, unknown: false };
          }
        }
        return item;
      })
    );
      // prevSelected.map((item, index) => {
      //   if (index === conditionIndex) {
      //     if (field === 'none' || field === 'unknown') {
      //       return { father: false, mother: false, siblings: false, none: field === 'none', unknown: field === 'unknown' };
      //     } else {
      //       return { ...item, [field]: !item[field], none: false, unknown: false };
      //     }
      //   }
      //   return item;
      // })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
  }

  return (
    <div>
      {/* <button onClick={handleSubmit} className='next-button'>Guardar</button> */}
      <form className="space-y-4">
        {/* Tabla de Antecedentes Hereditarios y Familiares */}
        <div>
          <h2 className="text-xl font-semibold mb-4">II. Antecedentes Hereditarios y Familiares</h2>
          <div className="flex justify-center">
            <table className="table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2"></th>
                  <th className="border border-gray-300 px-4 py-2">Padre</th>
                  <th className="border border-gray-300 px-4 py-2">Madre</th>
                  <th className="border border-gray-300 px-4 py-2">Hermanos</th>
                  <th className="border border-gray-300 px-4 py-2">Ninguno</th>
                  <th className="border border-gray-300 px-4 py-2">No sé</th>
                </tr>
              </thead>
              <tbody>
                {conditions.map((condition, conditionIndex) => (
                  <tr key={conditionIndex}>
                    <td className="border border-gray-300 px-4 py-2">{conditionLabels[conditionIndex]}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input type="checkbox" checked={formData[condition]['father']} onChange={() => handleCheckboxChange(condition, 'father')}/>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input type="checkbox" checked={formData[condition]['mother']} onChange={() => handleCheckboxChange(condition, 'mother')}/>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input type="checkbox" checked={formData[condition]['siblings']} onChange={() => handleCheckboxChange(condition, 'siblings')}/>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input type="checkbox" checked={formData[condition]['none']} onChange={() => handleCheckboxChange(condition, 'none')}/>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input type="checkbox" checked={formData[condition]['unknown']} onChange={() => handleCheckboxChange(condition, 'unknown')}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SeccionDos;
