import React, { useState } from 'react';



function SeccionTres({user, formData, setFormData}) {
  // const [formData, setFormData] = useState({
  //   inmunizaciones: '',
  //   alimentacion: {
  //     carne: false,
  //     leche: false,
  //     huevo: false,
  //     verdurasFrutas: false,
  //   },
  //   deportes: '',
  //   tabaquismo: {
  //     haFumado: '',
  //     masDe10: '',
  //     menosDe10: '',
  //   },
  //   alcoholismo: {
  //     bebidas: '',
  //     tresCopas: '',
  //     alMenosTresCopas: '',
  //     embriaguez: '',
  //   },
  //   toxicomanias: {
  //     drogas: '',
  //     frecuentes: '',
  //   },
  //   habitacion: {
  //     tipo: '',
  //     servicios: '',
  //   },
  //   convivencia: {
  //     conQuien: '',
  //     personas: '',
  //     cuartos: '',
  //   },
  //   empleo: {
  //     labura: '',
  //     detalles: '',
  //   }
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const [category, field] = name.split('.');
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [category]: {
  //       ...prevState[category],
  //       [field]: value,
  //     },
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      section_three: {
        ...formData.section_three,
        [name]: value
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">III. Antecedentes Personales No Patológicos</h2>
        {/* Inmunizaciones */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Inmunizaciones:</label>
          <div className="flex space-x-4">
            <label><input type="radio" name="inmunizaciones" value="completo" onChange={handleChange} /> Esquema Completo</label>
            <label><input type="radio" name="inmunizaciones" value="incompleto" onChange={handleChange} /> Esquema Incompleto</label>
            <label><input type="radio" name="inmunizaciones" value="ignora" onChange={handleChange} /> Lo Ignora</label>
          </div>
        </div>

        {/* Alimentación */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Alimentación:</label>
          <div className="grid grid-cols-2 gap-4">
            <label><input type="checkbox" name="alimentacion.carne" onChange={handleChange} /> Carne</label>
            <label><input type="checkbox" name="alimentacion.leche" onChange={handleChange} /> Leche</label>
            <label><input type="checkbox" name="alimentacion.huevo" onChange={handleChange} /> Huevo</label>
            <label><input type="checkbox" name="alimentacion.verdurasFrutas" onChange={handleChange} /> Verduras y frutas</label>
          </div>
        </div>

        {/* Deportes */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Deportes:</label>
          <div className="flex space-x-4">
            <label><input type="radio" name="deportes" value="mas3" onChange={handleChange} /> Más de 3 veces a la semana</label>
            <label><input type="radio" name="deportes" value="dosSemana" onChange={handleChange} /> 2 veces a la semana</label>
            <label><input type="radio" name="deportes" value="dosMes" onChange={handleChange} /> 2 veces al mes</label>
            <label><input type="radio" name="deportes" value="ninguna" onChange={handleChange} /> Ninguna vez</label>
          </div>
        </div>

        {/* Tabaquismo */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tabaquismo:</label>
          <div className="flex flex-col space-y-2">
            <label>¿Has fumado alguna vez?</label>
            <label>
              <input type="radio" name="tabaquismo.haFumado" value="si" onChange={handleChange}/> Sí
            </label>
            <label>
              <input type="radio" name="tabaquismo.haFumado" value="no" onChange={handleChange}/> No
            </label>
            {/* {
              if(true){
                (<p>Hello</p>)
              }
            } */}
            {formData.section_three.tabaquismo.haFumado === 'si' && (
              <>
                <label>¿Fumas más de 10 cigarros al día?</label>
                <label>
                  <input type="radio" name="tabaquismo.masDe10" value="si" onChange={handleChange}/> Sí
                </label>
                <label>
                  <input type="radio" name="tabaquismo.masDe10" value="no" onChange={handleChange}/> No
                </label>
                <label>¿Fumas menos de 10 cigarros al día?</label>
                <label>
                  <input type="radio" name="tabaquismo.menosDe10" value="si" onChange={handleChange}/> Sí
                </label>
                <label>
                  <input type="radio" name="tabaquismo.menosDe10" value="no" onChange={handleChange}/> No
                </label>
              </>
            )}
          </div>
        </div>  

        {/* Alcoholismo */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Alcoholismo:</label>
          <div className="flex flex-col space-y-2">
            <label>¿Has tomado bebidas alcohólicas?</label>
            <label>
              <input type="radio" name="alcoholismo.bebidas" value="si" onChange={handleChange}/> Sí
            </label>
            <label>
              <input type="radio" name="alcoholismo.bebidas" value="no" onChange={handleChange}/> No
            </label>
            {formData.section_three.alcoholismo.bebidas === 'si' && (
              <>
                <label>¿Consume más de tres copas a la semana?</label>
                <label>
                  <input type="radio" name="alcoholismo.tresCopas" value="si" onChange={handleChange}/> Sí
                </label>
                <label>
                  <input type="radio" name="alcoholismo.tresCopas" value="no" onChange={handleChange}/> No
                </label>
                <label>¿Consume al menos tres copas a la semana?</label>
                <label>
                  <input type="radio" name="alcoholismo.alMenosTresCopas" value="si" onChange={handleChange}/> Sí
                </label>
                <label>
                  <input type="radio" name="alcoholismo.alMenosTresCopas" value="no" onChange={handleChange}/> No
                </label>
                <label>¿Ha llegado a la embriaguez?</label>
                <label>
                  <input type="radio" name="alcoholismo.embriaguez" value="si" onChange={handleChange}/> Sí
                </label>
                <label>
                  <input type="radio" name="alcoholismo.embriaguez" value="no" onChange={handleChange}/> No
                </label>
              </>
            )}
          </div>
        </div>

        {/* Toxicomanías */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Toxicomanías:</label>
          <div className="flex space-x-4">
            <label>¿Has utilizado alguna droga?</label>
            <label>
              <input type="radio" name="toxicomanias.drogas" value="si" onChange={handleChange}/> Sí
            </label>
            <label>
              <input type="radio" name="toxicomanias.drogas" value="no" onChange={handleChange}/> No
            </label>
            {formData.section_three.toxicomanias.drogas === 'si' && (
              <>
                <label>¿Frecuentemente utilizas droga?</label>
                <label>
                  <input type="radio" name="toxicomanias.frecuentes" value="si" onChange={handleChange}/> Sí
                </label>
                <label>
                  <input type="radio" name="toxicomanias.frecuentes" value="no" onChange={handleChange}/> No
                </label>
              </>
            )}
          </div>
        </div>

        {/* Habitación */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tu casa es:</label>
          <div className="flex flex-col space-y-2">
            <label>
              <input type="radio" name="habitacion.tipo" value="propia" onChange={handleChange}/> Propia
            </label>
            <label>
              <input type="radio" name="habitacion.tipo" value="rentada" onChange={handleChange}/> Rentada
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">¿Con qué servicios cuenta?</label>
          <div className="flex flex-col space-y-2">
            <label>
              <input type="radio" name="habitacion.servicios" value="todos" onChange={handleChange}/> Todos los servicios
            </label>
            <label>
              <input type="radio" name="habitacion.servicios" value="comunes" onChange={handleChange}/> Servicios comunes
            </label>
            <label>
              <input type="radio" name="habitacion.servicios" value="ninguno" onChange={handleChange}/> No tiene servicios
            </label>
          </div>
        </div>

        {/* Convivencia */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">¿Con quién vives actualmente?</label>
          <div className="flex flex-col space-y-2">
            <label>
              <input type="checkbox" name="convivencia.padres"
                checked={formData.section_three.convivencia?.padres || false}
                onChange={handleChange}/> Padres
            </label>
            <label>
              <input type="checkbox" name="convivencia.familiares"
                checked={formData.section_three.convivencia?.familiares || false}
                onChange={handleChange}/> Familiares
            </label>
            <label>
              <input type="checkbox" name="convivencia.amigos"
                checked={formData.section_three.convivencia?.amigos || false}
                onChange={handleChange}/> Amigos
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">¿Cuántas personas viven contigo?</label>
          <div className="flex flex-col space-y-2">
            <label>
              <input type="radio" name="convivencia.personas" value="2-4" onChange={handleChange}/> De 2 a 4
            </label>
            <label>
              <input type="radio" name="convivencia.personas" value="5-6" onChange={handleChange}/> De 5 a 6
            </label>
            <label>
              <input type="radio" name="convivencia.personas" value="7+" onChange={handleChange}/> 7 o más
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">¿Cuántos cuartos tiene tu vivienda?</label>
          <div className="flex flex-col space-y-2">
            <label>
              <input type="radio" name="convivencia.cuartos" value="1-2" onChange={handleChange}/> De 1 a 2
            </label>
            <label>
              <input type="radio" name="convivencia.cuartos" value="3-4" onChange={handleChange}/> De 3 a 4
            </label>
            <label>
              <input type="radio" name="convivencia.cuartos" value="5-6" onChange={handleChange}/> De 5 a 6
            </label>
            <label>
              <input type="radio" name="convivencia.cuartos" value="7+" onChange={handleChange}/> 7 o más
            </label>
          </div>
        </div>

        {/* Empleo */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">¿Labura actualmente?</label>
          <div className="flex flex-col space-y-2">
            <label>
              <input type="radio" name="empleo.labura" value="si" onChange={handleChange}/> Sí
            </label>
            <label>
              <input type="radio" name="empleo.labura" value="no" onChange={handleChange}/> No
            </label>
            {formData.section_three.empleo.labura === 'si' && (
              <label className="block mt-2">
                Especifique empleo, duración y actividades:
                <textarea
                  name="empleo.detalles"
                  value={formData.section_three.empleo.detalles}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default SeccionTres;
