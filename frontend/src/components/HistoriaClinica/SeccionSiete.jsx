import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SeccionSiete() {
  const [form, setForm] = useState({
    dental_pieces_number: '',
    dental_cleaning: '',
    last_dental_checking: '',
    dental_pain: '',
    bloody_gums: '',
    mouth_pain: '',
    object_in_mouth: '',
    current_dental_treatment: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    navigate('/SeccionOchoYNueve');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Historia Clínica</h1>
      <form className="space-y-6">
        {/* Preguntas Odontológicas */}
        <h2 className="text-xl font-semibold mb-4">VII. Antecedentes Odontológicos</h2>
        <div className="space-y-4">
          {[
            {
              id: 'dental_pieces_number',
              question: '¿Sabes cuántas piezas dentales tienes?',
            },
            {
              id: 'dental_cleaning',
              question: '¿Te lavas los dientes después de cada alimento?',
            },
            {
              id: 'last_dental_checking',
              question: '¿Has asistido al servicio dental en el último año?',
            },
            {
              id: 'dental_pain',
              question: '¿Has tenido dolor dental recientemente?',
            },
            {
              id: 'bloody_gums',
              question: '¿Te sangran tus encías?',
            },
            {
              id: 'mouth_pain',
              question: '¿Tienes dolor al abrir o cerrar tu boca?',
            },
            {
              id: 'object_in_mouth',
              question: '¿Metes algún objeto extraño a la boca?',
            },
            {
              id: 'current_dental_treatment',
              question: '¿Actualmente tienes tratamiento dental?',
            },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <label htmlFor={item.id} className="text-base font-medium">
                {item.question}
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={item.id}
                    value="Sí"
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Sí</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={item.id}
                    value="No"
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default SeccionSiete;
