import React, { useState } from 'react';

function SeccionDiez() {
  const [form, setForm] = useState({
    digestive_abdomen_shape: false,
    digestive_hernias: false,
    digestive_diarreas: false,
    digestive_other_illnesses: false,
    respiratory_nose_shape: false,
    respiratory_clean_fields: false,
    respiratory_chest_shape: false,
    respiratory_chronic_cough: false,
    respiratory_asthma: false,
    respiratory_other_illnesses: false,
    cardiovascular_noises: false,
    cardiovascular_murmurs: false,
    cardiovascular_arrhythmias: false,
    cardiovascular_dyspnoea: false,
    cardiovascular_other_illnesses: false,
    urinary_urine_smell: false,
    urinary_urine_appearance: false,
    urinary_pain: false,
    urinary_wishes_to_urinate: false,
    urinary_other_illnesses: false,
    male_genitals_penis_retraction: false,
    male_genitals_scrotum_pain: false,
    male_genitals_testicles_in_scrotum: false,
    female_genitals_have_you_menstruate: false,
    female_genitals_regular_menstruation: false,
    female_genitals_pain_interferes_daily_life: false,
    female_genitals_are_genital_and_tits_normal: false,
    nervous_system_nervous_tics: false,
    nervous_system_convulsions: false,
    nervous_system_headache: false,
    nervous_system_sleep_well: false,
    skeletal_muscular_normal_posture: false,
    skeletal_muscular_scoliosis: false,
    skeletal_muscular_polio_after_effects: false,
    skeletal_muscular_plane_foot: false,
    skeletal_muscular_other_illnesses: false,
    endocrine_normal_weight: false,
    endocrine_overweight: false,
    endocrine_underweight: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">X. Interrogatorio por Aparato y Sistemas</h2>
      <form className="space-y-6">
        {[
          {
            title: 'Digestivo',
            fields: [
              { name: 'digestive_abdomen_shape', label: 'Forma del abdomen' },
              { name: 'digestive_hernias', label: 'Hernias' },
              { name: 'digestive_diarreas', label: 'Diarreas' },
              { name: 'digestive_other_illnesses', label: 'Otras patologías' },
            ],
          },
          {
            title: 'Respiratorio',
            fields: [
              { name: 'respiratory_nose_shape', label: 'Forma de nariz' },
              { name: 'respiratory_clean_fields', label: 'Campos limpios' },
              { name: 'respiratory_chest_shape', label: 'Forma del tórax' },
              { name: 'respiratory_chronic_cough', label: 'Tos crónica' },
              { name: 'respiratory_asthma', label: 'Asma' },
              { name: 'respiratory_other_illnesses', label: 'Otras patologías' },
            ],
          },
          {
            title: 'Cardiovascular',
            fields: [
              { name: 'cardiovascular_noises', label: 'Ruidos' },
              { name: 'cardiovascular_murmurs', label: 'Soplos' },
              { name: 'cardiovascular_arrhythmias', label: 'Arritmias' },
              { name: 'cardiovascular_dyspnoea', label: 'Disnea' },
              { name: 'cardiovascular_other_illnesses', label: 'Otras patologías' },
            ],
          },
          {
            title: 'Urinario',
            fields: [
              { name: 'urinary_urine_smell', label: 'Olor de orina' },
              { name: 'urinary_urine_appearance', label: 'Aspecto de orina' },
              { name: 'urinary_pain', label: 'Dolor' },
              { name: 'urinary_wishes_to_urinate', label: 'Deseos de orinar' },
              { name: 'urinary_other_illnesses', label: 'Otras patologías' },
            ],
          },
          {
            title: 'Genitales Masculinos',
            fields: [
              { name: 'male_genitals_penis_retraction', label: 'Retracción del pene' },
              { name: 'male_genitals_scrotum_pain', label: 'Dolor de escroto' },
              { name: 'male_genitals_testicles_in_scrotum', label: 'Testículos dentro de bolsa escrotal' },
            ],
          },
          {
            title: 'Genitales Femeninos',
            fields: [
              { name: 'female_genitals_have_you_menstruate', label: '¿Ya empezaste a menstruar?' },
              { name: 'female_genitals_regular_menstruation', label: '¿Tu menstruación es regular?' },
              { name: 'female_genitals_pain_interferes_daily_life', label: '¿Te causa dolor que impide hacer tu vida cotidiana?' },
              { name: 'female_genitals_are_genital_and_tits_normal', label: '¿Consideras normal la forma y tamaño de tus genitales y mamas?' },
            ],
          },
          {
            title: 'Sistema Nervioso',
            fields: [
              { name: 'nervous_system_nervous_tics', label: '¿Tienes algún tic nervioso?' },
              { name: 'nervous_system_convulsions', label: '¿Tienes convulsiones?' },
              { name: 'nervous_system_headache', label: '¿Tienes dolores de cabeza?' },
              { name: 'nervous_system_sleep_well', label: '¿Duermes bien?' },
            ],
          },
          {
            title: 'Sistema Músculo Esquelético',
            fields: [
              { name: 'skeletal_muscular_normal_posture', label: '¿Tienes postura normal?' },
              { name: 'skeletal_muscular_scoliosis', label: '¿Tienes escoliosis?' },
              { name: 'skeletal_muscular_polio_after_effects', label: '¿Tienes secuelas de polio?' },
              { name: 'skeletal_muscular_plane_foot', label: '¿Tienes pie plano?' },
              { name: 'skeletal_muscular_other_illnesses', label: 'Otras patologías' },
            ],
          },
          {
            title: 'Sistema Endocrino',
            fields: [
              { name: 'endocrine_normal_weight', label: '¿Tienes peso normal?' },
              { name: 'endocrine_overweight', label: '¿Estás pasado de peso?' },
              { name: 'endocrine_underweight', label: '¿Estás bajo de peso?' },
            ],
          },
        ].map((system) => (
          <fieldset key={system.title} className="border rounded p-4">
            <legend className="text-lg font-medium">{system.title}</legend>
            {system.fields.map((field) => (
              <div key={field.name} className="mb-2">
                <label className="text-sm">{field.label}</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    id={`${field.name}_yes`}
                    value="yes"
                    checked={form[field.name] === 'yes'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor={`${field.name}_yes`} className="mr-4">Sí</label>
                  <input
                    type="radio"
                    name={field.name}
                    id={`${field.name}_no`}
                    value="no"
                    checked={form[field.name] === 'no'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor={`${field.name}_no`}>No</label>
                </div>
              </div>
            ))}
          </fieldset>
        ))}
      </form>
    </div>
  );
}

export default SeccionDiez;
