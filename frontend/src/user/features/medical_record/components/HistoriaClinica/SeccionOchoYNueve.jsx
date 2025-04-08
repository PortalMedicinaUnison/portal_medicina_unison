import React, { useState } from 'react';


function SeccionOchoYNueve() {
  const [form, setForm] = useState({
    do_you_wear_glasses: '',
    glasses_reason: '',
    weight: '',
    size: '',
    bmi: '',
    heart_rate: '',
    respiratory_rate: '',
    blood_pressure: '',
    temperature: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form className="space-y-6">
        {/* Campos del formulario */}
        <h2 className="text-xl font-semibold mb-4">VIII. Signos Vitales y Somatometría</h2>
        <div className="space-y-4">
          {[
            { id: 'weight', label: 'Peso (kg)', type: 'number', placeholder: 'Ejemplo: 70' },
            { id: 'size', label: 'Talla (cm)', type: 'number', placeholder: 'Ejemplo: 170' },
            { id: 'bmi', label: 'IMC', type: 'number', placeholder: 'Ejemplo: 24' },
            { id: 'heart_rate', label: 'Frecuencia Cardíaca (pm)', type: 'number', placeholder: 'Ejemplo: 75' },
            { id: 'respiratory_rate', label: 'Frecuencia Respiratoria (pm)', type: 'number', placeholder: 'Ejemplo: 18' },
            { id: 'blood_pressure', label: 'Presión Arterial (mmHg)', type: 'text', placeholder: 'Ejemplo: 120/80' },
            { id: 'temperature', label: 'Temperatura (°C)', type: 'number', placeholder: 'Ejemplo: 36.5' },
          ].map((item) => (
            <div key={item.id} className="flex flex-col">
              <label htmlFor={item.id} className="text-sm font-medium mb-1">
                {item.label}
              </label>
              <input
                type={item.type}
                name={item.id}
                id={item.id}
                value={form[item.id]}
                onChange={handleChange}
                placeholder={item.placeholder}
                className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold mb-4">XI. Revisión Optométrica</h2>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">¿Usa lentes?</label>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="do_you_wear_glasses_yes"
              name="do_you_wear_glasses"
              value="yes"
              checked={form.do_you_wear_glasses === 'yes'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="do_you_wear_glasses_yes" className="mr-4">Sí</label>
            <input
              type="radio"
              id="do_you_wear_glasses_no"
              name="do_you_wear_glasses"
              value="no"
              checked={form.do_you_wear_glasses === 'no'}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="do_you_wear_glasses_no">No</label>
          </div>
          <label className="text-sm font-medium mb-1">¿Por qué motivo?</label>
          <input
            type="text"
            name="glasses_reason"
            value={form.glasses_reason}
            onChange={handleChange}
            placeholder="Ejemplo: Miopía, astigmatismo..."
            className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
          /> 
        </div>
      </form>
    </div>
  );
}

export default SeccionOchoYNueve;
