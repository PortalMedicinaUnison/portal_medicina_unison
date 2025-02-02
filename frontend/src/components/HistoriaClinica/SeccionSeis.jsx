import React, { useState } from 'react';


function SeccionSeis() {
  const [form, setForm] = useState({
    have_poor_health: '',
    bloody_diarrhea: '',
    weakness: '',
    pain: '',
    thristy: '',
    convulsions: '',
    fainting: '',
    stomachache: '',
    headache: '',
    hearing_issues: '',
    genital_issues: '',
    weird_urine: '',
    foot_cracks: '',
    joint_issues: '',
    nail_issues: '',
    chest_pain: '',
    unexplained_discomfort: '',
    unexplained_fever: '',
    weight_loss: '',
    eternal_cough: '',
    observations: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form className="space-y-6">
        {/* Pregunta principal */}
        <h2 className="text-xl font-semibold mb-4">VI. Padecimiento Actual</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">¿Actualmente te sientes mal de salud?</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="have_poor_health"
                value="true"
                onChange={handleChange}
                className="form-radio"
              />
              <span>Sí</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="have_poor_health"
                value="false"
                onChange={handleChange}
                className="form-radio"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Lista de síntomas */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            En el último mes, ¿has tenido molestias iguales o muy similares a estas?
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {[
              { id: 'bloody_diarrhea', label: 'Diarrea con sangre' },
              { id: 'weakness', label: 'Debilidad, cansancio, te has puesto pálido, te falta el aire al realizar ejercicio' },
              { id: 'pain', label: 'Dolor, distensión abdominal con diarrea, falta de apetito y debilidad general' },
              { id: 'thristy', label: 'Debilidad que se acompaña con aumento importante de sed y en la cantidad de orina' },
              { id: 'convulsions', label: 'Convulsiones (ataques)' },
              { id: 'fainting', label: 'Desmayos en varias ocasiones' },
              { id: 'stomachache', label: 'Dolor punzante o ardoroso en la boca del estómago, que se acompaña a veces con náuseas, eructos y hasta llegar al vómito' },
              { id: 'headache', label: 'Dolor de cabeza, sensación de mareo que se acompaña de zumbido de oídos' },
              { id: 'hearing_issues', label: 'Problemas para oír' },
              { id: 'genital_issues', label: 'En tus genitales: comezón, ronchas enrojecimiento y algún escurrimiento' },
              { id: 'weird_urine', label: 'Tu orina no es transparente y se acompaña de molestias para orinar, ardor, dolor, deseos de seguir orinando' },
              { id: 'foot_cracks', label: 'Grietas o vejigas en los pies y has notado que te provocan comezón y mal olor' },
              { id: 'joint_issues', label: 'Alguna articulación se inflama, se pone roja y duele sin que te hayas golpeado' },
              { id: 'nail_issues', label: 'Tus uñas se han puesto opacas y gruesas'},
              { id: 'chest_pain', label: 'Dolor de pecho, espalda que aumenta cuando respiras' },
              { id: 'unexplained_discomfort', label: 'Aparición de molestias sin causa aparente' },
              { id: 'unexplained_fever', label: 'Fiebre sin causa aparente' },
              { id: 'weight_loss', label: 'Pérdida de peso' },
              { id: 'eternal_cough', label: 'Tos que no se te quita' },
            ].map((item) => (
              <div key={item.id}>
                <label className="block text-base font-medium">
                  {item.label}
                </label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={item.id}
                      value="true"
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span>Sí</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={item.id}
                      value="false"
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default SeccionSeis;
