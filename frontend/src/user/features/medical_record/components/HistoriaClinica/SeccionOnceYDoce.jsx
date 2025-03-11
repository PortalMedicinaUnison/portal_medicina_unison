import React, { useState } from 'react';

function SeccionOnceYDoce() {
  const [form, setForm] = useState({
    external_appearance: '',
    head: '',
    neck: '',
    chest: '',
    abdomen: '',
    genitals: '',
    limbs: '',
    lab_exam: '',
    therapeutics_used: '',
    diagnosis: '',
    treatment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // Aquí puedes enviar los datos al backend
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* XI. Hábitos Exterior */}
        <fieldset className="border rounded p-4">
          <legend className="text-lg font-medium">XI. Hábitos Exterior</legend>
          <div className="flex flex-col mb-4">
            <label htmlFor="external_appearance" className="text-sm font-medium mb-1">
              Descripción de Hábitos Exterior:
            </label>
            <textarea
              id="external_appearance"
              name="external_appearance"
              value={form.external_appearance}
              onChange={handleChange}
              placeholder="Ejemplo: Buena higiene, vestimenta adecuada..."
              className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              rows="3"
            />
          </div>
        </fieldset>

        {/* XII. Exploración Física */}
        <fieldset className="border rounded p-4">
          <legend className="text-lg font-medium">XII. Exploración Física</legend>
          {[
            { id: 'head', label: 'Cabeza' },
            { id: 'neck', label: 'Cuello' },
            { id: 'chest', label: 'Tórax' },
            { id: 'abdomen', label: 'Abdomen' },
            { id: 'genitals', label: 'Genitales' },
            { id: 'limbs', label: 'Extremidades' },
            { id: 'lab_exam', label: 'Exámenes de laboratorio y gabinete' },
            { id: 'therapeutics_used', label: 'Terapéutica empleada' },
            { id: 'diagnosis', label: 'Diagnóstico' },
            { id: 'treatment', label: 'Tratamiento' },
          ].map((field) => (
            <div key={field.id} className="flex flex-col mb-4">
              <label htmlFor={field.id} className="text-sm font-medium mb-1">
                {field.label}:
              </label>
              <textarea
                id={field.id}
                name={field.id}
                value={form[field.id]}
                onChange={handleChange}
                placeholder={`Escribe los hallazgos en ${field.label.toLowerCase()}...`}
                className="border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
                rows="3"
              />
            </div>
          ))}
        </fieldset>
      </form>
    </div>
  );
}

export default SeccionOnceYDoce;
