import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllInternshipApplicationsRequest } from '../../../services/internshipService';
import { getAllSocialServiceApplicationsRequest } from '../../../services/socialServiceService';
import { PROGRAM_STEPS, describeStep } from './myProcess';

const TONES = {
  todo: 'border-indigo-200 bg-indigo-50',
  wait: 'border-gray-200 bg-white',
  done: 'border-green-200 bg-green-50',
  closed: 'border-amber-200 bg-amber-50',
};

/**
 * "Mi proceso" en el inicio del alumno: en qué etapa va y qué le toca hacer, con un enlace directo.
 * Muestra el servicio social si ya tiene una asignación de servicio social; si no, el internado.
 */
function MyProcessCard() {
  const [state, setState] = useState({ loading: true, internship: null, socialService: null });

  useEffect(() => {
    let active = true;
    Promise.all([getAllInternshipApplicationsRequest(), getAllSocialServiceApplicationsRequest()])
      .then(([internships, socialServices]) => {
        if (active) setState({ loading: false, internship: internships.data[0] ?? null, socialService: socialServices.data[0] ?? null });
      })
      .catch(() => { if (active) setState({ loading: false, internship: null, socialService: null, error: true }); });
    return () => { active = false; };
  }, []);

  if (state.loading) return <div className="h-28 animate-pulse rounded-lg border border-gray-200 bg-gray-50" aria-hidden="true" />;
  if (state.error) return null;

  const steps = state.socialService ? PROGRAM_STEPS.socialService : PROGRAM_STEPS.internship;
  const step = describeStep(steps, state.socialService ?? state.internship);

  return (
    <section className={`rounded-lg border p-5 ${TONES[step.tone]}`} aria-labelledby="my-process-title">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mi proceso</p>
      <h3 id="my-process-title" className="mt-1 text-lg font-semibold text-gray-900">{steps.name}</h3>
      <p className="mt-2 text-sm text-gray-700">{step.text}</p>
      {step.action && (
        <Link to={step.action.to} className={`mt-4 inline-block ${step.tone === 'todo' ? 'btn-primary' : 'btn-secondary'}`}>
          {step.action.label}
        </Link>
      )}
    </section>
  );
}

export default MyProcessCard;
