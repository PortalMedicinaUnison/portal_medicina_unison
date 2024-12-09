import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function SeccionCuatro() {
  const [formData, setFormData] = useState({
    enfermedades_eruptivas: {
      sarampion: false,
      escarlatina: false,
      varicela: false,
      parotiditis: false,
      rubeola: false,
    },
    enfermedades_infecciosas: {
      herpes: false,
      meningitis: false,
      tifoidea: false,
      hepatitis: false,
      amigdalitis: false,
    },
    traumatismos: {
      luxacion: false,
      fractura: false,
      golpes_cabeza: false,
      heridas_blanca: false,
      heridas_fuego: false,
    },
    antecedentes_transfusionales: {
      transfusion: false,
      fecha: '',
    },
    enfermedades_parasitarias: {
      parasitos: false,
    },
    enfermedades_venereas: {
      venerea: false,
      cual: '',
    },
    enfermedades_cronicas: {
      artropatias: false,
      cardiopatias: false,
      tiroides: false,
      hipertension: false,
      diabetes: false,
      tratamiento_actual: '',
    },
    antecedentes_quirurgicos: {
      operado: false,
      cirugias_previas: '',
    },
    sistema_nervioso: {
      ataques: false,
      paralisis: false,
    },
    antecedentes_alergicos: {
      alergico_alimento: false,
      alergico_medicamento: false,
      especifica: '',
    },
    antecedentes_psicologicos_psiquiatricos: {
      psicologico: false,
      psiquiatrico: false,
      tratamiento_actual: '',
      pensamientos_suicidas: false,
    },
    covid19: {
      tuvo_covid: false,
      fecha: '',
      complicaciones: ''
    },
    vacunacion: {
      primera_dosis: '',
      segunda_dosis: '',
      refuerzo: ''
    }
  });

  const handleCheckboxChange = (e, category, subCategory) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [subCategory]: e.target.checked,
      },
    });
  };

  const handleInputChange = (e, category, subCategory) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [subCategory]: e.target.value,
      },
    });
  };


  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/SeccionCinco');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Historia Clínica</h1>
      <form className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">IV. Antecedentes Personales Patológicos</h2>
        <h3 className='font-bold text-red-500'>Marca la casilla en caso de que sí</h3>
        {/* Enfermedades Eruptivas */}
        <fieldset className="mb-4">
          <legend className="font-bold">Enfermedades Eruptivas</legend>
          {Object.keys(formData.enfermedades_eruptivas).map((disease) => (
            <label key={disease} className="block">
              <input
                type="checkbox"
                checked={formData.enfermedades_eruptivas[disease]}
                onChange={(e) => handleCheckboxChange(e, 'enfermedades_eruptivas', disease)}
              />
              {` ${disease.charAt(0).toUpperCase() + disease.slice(1)}`}
            </label>
          ))}
        </fieldset>

        {/* Enfermedades Infecciosas */}
        <fieldset className="mb-4">
          <legend className="font-bold">Enfermedades Infecciosas</legend>
          {Object.keys(formData.enfermedades_infecciosas).map((disease) => (
            <label key={disease} className="block">
              <input
                type="checkbox"
                checked={formData.enfermedades_infecciosas[disease]}
                onChange={(e) => handleCheckboxChange(e, 'enfermedades_infecciosas', disease)}
              />
              {` ${disease.charAt(0).toUpperCase() + disease.slice(1)}`}
            </label>
          ))}
        </fieldset>

        {/* Traumatismos */}
        <fieldset className="mb-4">
          <legend className="font-bold">Traumatismos</legend>
          {Object.keys(formData.traumatismos).map((injury) => (
            <label key={injury} className="block">
              <input
                type="checkbox"
                checked={formData.traumatismos[injury]}
                onChange={(e) => handleCheckboxChange(e, 'traumatismos', injury)}
              />
              {` ${injury.replace('_', ' ').charAt(0).toUpperCase() + injury.replace('_', ' ').slice(1)}`}
            </label>
          ))}
        </fieldset>

        {/* Antecedentes Transfusionales */}
        <fieldset className="mb-4">
          <legend className="font-bold">Antecedentes Transfusionales</legend>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_transfusionales.transfusion}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_transfusionales', 'transfusion')}
            />
            {' ¿Te han puesto sangre alguna vez?'}
          </label>
          {formData.antecedentes_transfusionales.transfusion && (
            <label className="block mt-2">
              ¿Cuándo?
              <input
                type="text"
                value={formData.antecedentes_transfusionales.fecha}
                onChange={(e) => handleInputChange(e, 'antecedentes_transfusionales', 'fecha')}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
          )}
        </fieldset>

        {/* Enfermedades Parasitarias */}
        <fieldset className="mb-4">
          <legend className="font-bold">Enfermedades Parasitarias</legend>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.enfermedades_parasitarias.parasitos}
              onChange={(e) => handleCheckboxChange(e, 'enfermedades_parasitarias', 'parasitos')}
            />
            {' ¿Has tenido parásitos intestinales alguna vez?'}
          </label>
        </fieldset>

        {/* Enfermedades Venéreas */}
        <fieldset className="mb-4">
          <legend className="font-bold">Enfermedades Venéreas</legend>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.enfermedades_venereas.venerea}
              onChange={(e) => handleCheckboxChange(e, 'enfermedades_venereas', 'venerea')}
            />
            {' ¿Has tenido alguna enfermedad de transmisión sexual?'}
          </label>
          {formData.enfermedades_venereas.venerea && (
            <label className="block mt-2">
              ¿Cuál?
              <input
                type="text"
                value={formData.enfermedades_venereas.cual}
                onChange={(e) => handleInputChange(e, 'enfermedades_venereas', 'cual')}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
          )}
        </fieldset>

        {/* Enfermedades Crónicas */}
        <fieldset className="mb-4">
          <legend className="font-bold">Enfermedades Crónicas</legend>
          {Object.keys(formData.enfermedades_cronicas).map((condition) => (
            condition !== 'tratamiento_actual' ? (
              <label key={condition} className="block">
                <input
                  type="checkbox"
                  checked={formData.enfermedades_cronicas[condition]}
                  onChange={(e) => handleCheckboxChange(e, 'enfermedades_cronicas', condition)}
                />
                {` ${condition.charAt(0).toUpperCase() + condition.slice(1)}`}
              </label>
            ) : (
              <label key={condition} className="block mt-2">
                Tratamiento actual:
                <input
                  type="text"
                  value={formData.enfermedades_cronicas.tratamiento_actual}
                  onChange={(e) => handleInputChange(e, 'enfermedades_cronicas', 'tratamiento_actual')}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
            )
          ))}
        </fieldset>

        {/* Antecedentes Quirúrgicos */}
        <fieldset className="mb-4">
          <legend className="font-bold">Antecedentes Quirúrgicos</legend>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_quirurgicos.operado}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_quirurgicos', 'operado')}
            />
            {' ¿Has sido operado alguna vez?'}
          </label>
          {formData.antecedentes_quirurgicos.operado && (
            <label className="block mt-2">
              ¿Qué cirugías has tenido?
              <input
                type="text"
                value={formData.antecedentes_quirurgicos.cirugias_previas}
                onChange={(e) => handleInputChange(e, 'antecedentes_quirurgicos', 'cirugias_previas')}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
          )}
        </fieldset>

        {/* Sistema Nervioso */}
        <fieldset className="mb-4">
          <legend className="font-bold">Sistema Nervioso</legend>
          {Object.keys(formData.sistema_nervioso).map((condition) => (
            <label key={condition} className="block">
              <input
                type="checkbox"
                checked={formData.sistema_nervioso[condition]}
                onChange={(e) => handleCheckboxChange(e, 'sistema_nervioso', condition)}
              />
              {` ¿Has tenido ${condition.replace('_', ' ')} alguna vez?`}
            </label>
          ))}
        </fieldset>
        
        {/* Antecedentes Alergicos, di "Eres alérgico a:" y luego 3 casillas, "Algún alimento", 
        "Algún medicamento", "Otro", en caso de elegir otro que sea abra un recuadro de texto
        que diga "Especifique" */}
        <fieldset className="mb-4">
          <legend className="font-bold">Antecedentes Alergicos</legend>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_alergicos.alimento}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_alergicos', 'alimento')}
            />
            ¿Eres alérgico a algún alimento?
          </label>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_alergicos.medicamento}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_alergicos', 'medicamento')}
            />
            ¿Eres alérgico a algún medicamento?
          </label>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_alergicos.otro}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_alergicos', 'otro')}
            />
            ¿Eres alérgico a otro?
          </label>
          {formData.antecedentes_alergicos.otro && (
            <label className="block mt-2">
              Especifique:
              <input
                type="text"
                value={formData.antecedentes_alergicos.especifica}
                onChange={(e) => handleInputChange(e, 'antecedentes_alergicos', 'especifica')}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
          )}
        </fieldset>

        {/* Antecedentes Psicológicos y Psiquiátricos */}
        <fieldset className="mb-4">
          <legend className="font-bold">Antecedentes Psicológicos y Psiquiátricos</legend>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_psicologicos_psiquiatricos.psicologico}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_psicologicos_psiquiatricos', 'psicologico')}
            />
            ¿Has llevado tratamiento psicológico?
          </label>
          {formData.antecedentes_psicologicos_psiquiatricos.psicologico && (
            <label className="block mt-2">
              Tratamiento actual:
              <input
                type="text"
                value={formData.antecedentes_psicologicos_psiquiatricos.tratamiento_psicologico_actual}
                onChange={(e) => handleInputChange(e, 'antecedentes_psicologicos_psiquiatricos', 'tratamiento_psicologico_actual')}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
          )}
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_psicologicos_psiquiatricos.psiquiatrico}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_psicologicos_psiquiatricos', 'psiquiatrico')}
            />
            ¿Has llevado tratamiento psiquiátrico?
          </label>
          {formData.antecedentes_psicologicos_psiquiatricos.psiquiatrico && (
            <label className="block mt-2">
              Tratamiento actual:
              <input
                type="text"
                value={formData.antecedentes_psicologicos_psiquiatricos.tratamiento_psiquiatrico_actual}
                onChange={(e) => handleInputChange(e, 'antecedentes_psicologicos_psiquiatricos', 'tratamiento_psiquiatrico_actual')}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </label>
          )}
          <label className="block">
            <input
              type="checkbox"
              checked={formData.antecedentes_psicologicos_psiquiatricos.pensamientos_suicidas}
              onChange={(e) => handleCheckboxChange(e, 'antecedentes_psicologicos_psiquiatricos', 'pensamientos_suicidas')}
            />
            ¿Has tenido pensamientos suicidas?
          </label>
        </fieldset>

        {/* COVID-19 */}
        <fieldset className="mb-4">
          <legend className="font-bold">Enfermedad por Covid-19</legend>
          <label className="block">
            <input
              type="checkbox"
              checked={formData.covid19.tuvo_covid}
              onChange={(e) => handleCheckboxChange(e, 'covid19', 'tuvo_covid')}
            />
            ¿Has tenido COVID-19?
          </label>
          {formData.covid19.tuvo_covid && (
            <>
              <label className="block mt-2">
                ¿Cuándo?
                <input
                  type="text"
                  value={formData.covid19.fecha}
                  onChange={(e) => handleInputChange(e, 'covid19', 'fecha')}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
              <label className="block mt-2">
                Complicaciones:
                <input
                  type="text"
                  value={formData.covid19.complicaciones}
                  onChange={(e) => handleInputChange(e, 'covid19', 'complicaciones')}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
            </>
          )}
        </fieldset>
        
        <fieldset className="mb-4">
          <legend className="font-bold">Vacunación</legend>
          <label className="block">
            Primera dosis:
            <input
              type="text"
              value={formData.vacunacion.primera_dosis}
              onChange={(e) => handleInputChange(e, 'vacunacion', 'primera_dosis')}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mt-2">
            Segunda dosis:
            <input
              type="text"
              value={formData.vacunacion.segunda_dosis}
              onChange={(e) => handleInputChange(e, 'vacunacion', 'segunda_dosis')}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mt-2">
            Refuerzo:
            <input
              type="text"
              value={formData.vacunacion.refuerzo}
              onChange={(e) => handleInputChange(e, 'vacunacion', 'refuerzo')}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </label>
        </fieldset>
      </form>
    </div>
  );
}

export default SeccionCuatro;
