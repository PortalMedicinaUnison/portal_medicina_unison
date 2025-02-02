import React, { useState } from 'react';


function SeccionCinco() {
  const [formData, setFormData] = useState({
    // Antecedentes Ginecológicos (V_A_GynecologicalHistory)
    menarche: '',
    menstrual_duration: '',
    menstrual_rhythm: '',
    dysmenorrhea: '',
    were_pregnant: '',
    contraceptive_methods: '',
    pap_smear_test: '',

    // Antecedentes Sexuales (V_B_SexualHistory)
    active_sex_life: '',
    sexual_partners_number: '',
    sexual_orientation: '',
    sexual_partners: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div>
      <form className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">V. Antecedentes Ginecológicos</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Menarca */}
            <label className="block">
              Menarca (Edad):
              <input
                type="text"
                name="menarche"
                value={formData.menarche}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>

            {/* Ritmo Menstrual */}
            <label className="block">
              Ritmo Menstrual:
              <select
                name="menstrual_rhythm"
                value={formData.menstrual_rhythm}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Entre 23 y 28 días">Entre 23 y 28 días</option>
                <option value="Entre 29 y 32 días">Entre 29 y 32 días</option>
                <option value="Irregular">Irregular</option>
              </select>
            </label>

            {/* Dismenorrea */}
            <label className="block">
              Dismenorrea:
              <select
                name="dysmenorrhea"
                value={formData.dysmenorrhea}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="Algunas veces">Algunas veces</option>
              </select>
            </label>

            {/* Embarazo */}
            <label className="block">
              ¿Te has embarazado alguna vez?:
              <select
                name="were_pregnant"
                value={formData.were_pregnant}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>

            {/* Método Anticonceptivo */}
            <label className="block">
              ¿Usas algún método anticonceptivo?:
              <select
                name="contraceptive_methods"
                value={formData.contraceptive_methods}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>

            {/* Papanicolaou */}
            <label className="block">
              ¿Último Papanicolau Cérvico-Uterino?:
              <select
                name="pap_smear_test"
                value={formData.pap_smear_test}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>
          </div>
        </div>

        {/* Antecedentes Sexuales */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Antecedentes Sexuales</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Vida Sexual Activa:
              <select
                name="active_sex_life"
                value={formData.active_sex_life}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>

            <label className="block">
              Número de Parejas Sexuales:
              <input
                type="number"
                name="sexual_partners_number"
                value={formData.sexual_partners_number}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>

            <label className="block">
              Orientación Sexual:
              <input
                type="text"
                name="sexual_orientation"
                value={formData.sexual_orientation}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>

            <label className="block">
              Parejas Sexuales (Hombres, Mujeres, Ambos):
              <select
                name="sexual_partners"
                value={formData.sexual_partners}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Hombres">Hombres</option>
                <option value="Mujeres">Mujeres</option>
                <option value="Ambos">Ambos</option>
              </select>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SeccionCinco;
