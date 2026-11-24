import { ROUTES } from '../../../config';
import { APPLICATION_STATUS } from '../../../utils/constants';
import { formatDate, promotionLabel } from '../../../utils/utils';

// Lo que cambia entre internado y servicio social al describir en qué va el alumno.
export const PROGRAM_STEPS = {
  internship: {
    name: 'Internado',
    record: 'internship',
    place: 'sede',
    finished: 'Acreditaste el internado. Cuando la coordinación te asigne al servicio social, aquí verás qué sigue.',
    applicationPath: ROUTES.USER.INTERNSHIP_APPLICATION_STATUS,
    declinedPath: ROUTES.USER.INTERNSHIP_APPLICATION_DECLINED,
    recordPath: ROUTES.USER.INTERNSHIP,
    recordLabel: 'Ver mi internado',
  },
  socialService: {
    name: 'Servicio social',
    record: 'social_service',
    place: 'plaza',
    finished: 'Liberaste tu servicio social.',
    applicationPath: ROUTES.USER.SOCIAL_SERVICE_APPLICATION_STATUS,
    declinedPath: ROUTES.USER.SOCIAL_SERVICE_APPLICATION_DECLINED,
    recordPath: ROUTES.USER.SOCIAL_SERVICE,
    recordLabel: 'Ver mi servicio social',
  },
};

/**
 * Etapa y siguiente paso del alumno en un programa, a partir de su asignación más reciente
 * (con el resumen de su internado o servicio social y el avance de sus documentos de inscripción).
 * Devuelve { tone, text, action? }; tone: 'todo' (le toca hacer algo), 'wait', 'done' o 'closed'.
 */
export function describeStep(steps, application) {
  if (!application) {
    return { tone: 'wait', text: 'Aún no tienes una asignación. Cuando la coordinación te asigne a una promoción, aquí verás qué sigue.' };
  }
  const promotion = promotionLabel(application.promotion);
  const status = Number(application.status);
  const progress = application.inscription_progress;

  if (status === APPLICATION_STATUS.PENDING) {
    if (progress && progress.required > 0 && !progress.all_submitted) {
      return {
        tone: 'todo',
        text: `Tienes una asignación en la promoción ${promotion}. Sube tus documentos obligatorios de inscripción (llevas ${progress.submitted} de ${progress.required}) y después acepta tu lugar.`,
        action: { label: 'Subir mis documentos', to: steps.applicationPath },
      };
    }
    return {
      tone: 'todo',
      text: `Tienes una asignación en la promoción ${promotion}. Lee la carta de compromiso y acepta tu lugar (o declínalo).`,
      action: { label: 'Responder mi asignación', to: steps.applicationPath },
    };
  }
  if (status === APPLICATION_STATUS.DECLINED) {
    return { tone: 'closed', text: `Declinaste tu asignación a la promoción ${promotion}.`, action: { label: 'Ver detalle', to: steps.declinedPath } };
  }

  const record = application[steps.record];
  if (!record) return { tone: 'wait', text: `Aceptaste tu asignación a la promoción ${promotion}.`, action: { label: steps.recordLabel, to: steps.recordPath } };
  const recordStatus = Number(record.status);
  const action = { label: steps.recordLabel, to: steps.recordPath };

  if (recordStatus === 3) return { tone: 'done', text: steps.finished, action };
  if (recordStatus === 4 || recordStatus === 5) {
    return {
      tone: 'closed',
      text: `Tu ${steps.name.toLowerCase()} terminó por ${recordStatus === 4 ? 'renuncia' : 'baja'} el ${formatDate(record.exit_date, { dateStyle: 'long' })}.`,
      action,
    };
  }
  if (recordStatus === 2) {
    return { tone: 'wait', text: `Tu ${steps.name.toLowerCase()} está suspendido. Si tienes dudas, acude a la coordinación.`, action };
  }
  if (!record.site) {
    return {
      tone: 'wait',
      text: progress?.complete
        ? `Tus documentos de inscripción están aprobados. Tu ${steps.place} se registra cuando la elijas en el acto público.`
        : `La coordinación está revisando tus documentos de inscripción${progress ? ` (${progress.approved} de ${progress.required} aprobados)` : ''}. Si alguno tiene observaciones, corrígelo.`,
      action,
    };
  }
  return {
    tone: 'todo',
    text: `En curso en ${record.site.name}. Sube los documentos que se piden durante el programa y al terminarlo.`,
    action,
  };
}
