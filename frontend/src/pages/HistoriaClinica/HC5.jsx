import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function HistoriaClinica5() {
  const [formData, setFormData] = useState({

    antecedentes_ginecologicos: {
      menarca: '',
      duracion_menstrual: '',
      ritmo_menstrual: '',
      dismenorrea: false,
      embarazo: false,
      anticonceptivo: false,
      papanicolaou: {
        resultado: '',
        fecha: ''
      }
    },
    antecedentes_sexuales: {
      vida_sexual_activa: false,
      num_parejas: '',
      orientacion_sexual: '',
      parejas_sexuales: ''
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Historia Clínica</h1>
        <form className="space-y-4">
          <div>
          <h2 className="text-xl font-semibold mb-4">V. Antecedentes Ginecológicos</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Menarca */}
            <label className="block">
              Menarca (Edad):
              <input
                type="text"
                name="menarca"
                value={formData.antecedentes_ginecologicos.menarca}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Edad:
              <input
                type="text"
                name="edad_menarca"
                value={formData.antecedentes_ginecologicos.edad_menarca}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>

            {/* Ritmo Menstrual */}
            <label className="block">
              Ritmo Menstrual:
              <select
                name="ritmo_menstrual"
                value={formData.antecedentes_ginecologicos.ritmo_menstrual}
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
                name="dismenorrea"
                value={formData.antecedentes_ginecologicos.dismenorrea}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="Algunas veces">Algunas veces</option>
              </select>
            </label>
            {(formData.antecedentes_ginecologicos.dismenorrea === 'Sí' || formData.antecedentes_ginecologicos.dismenorrea === 'Algunas veces') && (
              <label className="block">
                Tratamiento:
                <input
                  type="text"
                  name="tratamiento_dismenorrea"
                  value={formData.antecedentes_ginecologicos.tratamiento_dismenorrea}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
            )}

            {/* Embarazo */}
            <label className="block">
              ¿Te has embarazado alguna vez?:
              <select
                name="embarazo"
                value={formData.antecedentes_ginecologicos.embarazo}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>
            {formData.antecedentes_ginecologicos.embarazo === 'Sí' && (
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  G:
                  <input
                    type="text"
                    name="g"
                    value={formData.antecedentes_ginecologicos.g}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  P:
                  <input
                    type="text"
                    name="p"
                    value={formData.antecedentes_ginecologicos.p}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  A:
                  <input
                    type="text"
                    name="a"
                    value={formData.antecedentes_ginecologicos.a}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  C:
                  <input
                    type="text"
                    name="c"
                    value={formData.antecedentes_ginecologicos.c}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  Fecha:
                  <input
                    type="text"
                    name="fecha_embarazo"
                    value={formData.antecedentes_ginecologicos.fecha_embarazo}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>
              </div>
            )}

            {/* Método Anticonceptivo */}
            <label className="block">
              ¿Usas algún método anticonceptivo?:
              <select
                name="anticonceptivo"
                value={formData.antecedentes_ginecologicos.anticonceptivo}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>
            {formData.antecedentes_ginecologicos.anticonceptivo === 'Sí' && (
              <label className="block">
                ¿Cuál?:
                <input
                  type="text"
                  name="tipo_anticonceptivo"
                  value={formData.antecedentes_ginecologicos.tipo_anticonceptivo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
            )}

            {/* Papanicolaou */}
            <label className="block">
              ¿Último Papanicolau Cérvico-Uterino?:
              <select
                name="papanicolaou"
                value={formData.antecedentes_ginecologicos.papanicolaou}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>
            {formData.antecedentes_ginecologicos.papanicolaou === 'Sí' && (
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  Fecha:
                  <input
                    type="text"
                    name="fecha_papanicolaou"
                    value={formData.antecedentes_ginecologicos.fecha_papanicolaou}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  Resultado:
                  <input
                    type="text"
                    name="resultado_papanicolaou"
                    value={formData.antecedentes_ginecologicos.resultado_papanicolaou}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Antecedentes Sexuales */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Antecedentes Sexuales</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Vida Sexual Activa:
              <select
                name="vida_sexual_activa"
                value={formData.antecedentes_sexuales.vida_sexual_activa}
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
                type="text"
                name="num_parejas"
                value={formData.antecedentes_sexuales.num_parejas}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Orientación Sexual:
              <input
                type="text"
                name="orientacion_sexual"
                value={formData.antecedentes_sexuales.orientacion_sexual}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
            <label className="block">
              Parejas Sexuales (Hombres, Mujeres, Ambos):
              <select
                name="parejas_sexuales"
                value={formData.antecedentes_sexuales.parejas_sexuales}
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
  
            {/* Botón de Enviar */}

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HistoriaClinica5;
