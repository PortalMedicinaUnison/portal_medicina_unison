import { ROUTES, adminAbs } from '../../../config';
import {
  APPLICATION_STATUS, INTERNSHIP_STATUS_LABELS, PROGRAMS, SOCIAL_SERVICE_STATUS_LABELS,
} from '../../../utils/constants';

// Lo que cambia entre internado y servicio social en las pantallas de inscripciones.
export const INSCRIPTION_PROGRAMS = {
  [PROGRAMS.INTERNSHIP]: {
    program: PROGRAMS.INTERNSHIP,
    name: 'Internado',
    recordName: 'internado',
    recordKey: 'internship',
    recordIdKey: 'internship_id',
    placeLabel: 'Sede',
    recordStatusLabels: INTERNSHIP_STATUS_LABELS,
    // Qué implica registrar una renuncia (4) o una baja (5), según el formato y el manual del internado.
    exitHints: {
      4: 'Regístrala al recibir el formato de renuncia firmado. El lugar en la sede queda libre y el alumno podrá asignarse a una promoción posterior.',
      5: 'Baja o cancelación por las causales del manual del internado. El lugar en la sede queda libre y el alumno ya no podrá modificar sus documentos.',
    },
    listPath: adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_LIST),
    plazaResultsPath: adminAbs(ROUTES.ADMIN.INTERNSHIP_PLAZA_RESULTS),
    detailPath: (applicationId) => adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_DETAIL(applicationId)),
  },
  [PROGRAMS.SOCIAL_SERVICE]: {
    program: PROGRAMS.SOCIAL_SERVICE,
    name: 'Servicio social',
    recordName: 'servicio social',
    recordKey: 'social_service',
    recordIdKey: 'social_service_id',
    placeLabel: 'Plaza',
    recordStatusLabels: SOCIAL_SERVICE_STATUS_LABELS,
    // Lineamientos del servicio social: renuncia (art. 55) y baja o cancelación (sanciones).
    exitHints: {
      4: 'La plaza queda libre. Según el art. 55 de los lineamientos, podrá inscribirse a una nueva promoción un año después de su renuncia (salvo dictamen por enfermedad o fuerza mayor).',
      5: 'Baja o cancelación por las causales de los lineamientos del servicio social. La plaza queda libre y el alumno ya no podrá modificar sus documentos.',
    },
    // La renuncia a servicio social espera un año para reinscribirse (art. 55).
    waitAfterWithdrawal: true,
    listPath: adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_LIST),
    plazaResultsPath: adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_PLAZA_RESULTS),
    detailPath: (applicationId) => adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_DETAIL(applicationId)),
  },
};

// Estatus de la inscripción completa: la asignación y, si ya aceptó, su internado o servicio social.
export function inscriptionStatus(application, config) {
  const status = Number(application.status);
  if (status === APPLICATION_STATUS.PENDING) return { key: 'pending', label: 'Por aceptar' };
  if (status === APPLICATION_STATUS.DECLINED) return { key: 'declined', label: 'Declinó' };
  const record = application[config.recordKey];
  if (!record) return { key: 'accepted', label: 'Aceptada' };
  const recordStatus = Number(record.status);
  const label = config.recordStatusLabels[recordStatus] ?? 'Desconocido';
  return { key: `record-${recordStatus}`, label };
}

export function statusFilterOptions(config) {
  return [
    { value: 'pending', label: 'Por aceptar' },
    { value: 'declined', label: 'Declinó' },
    ...Object.entries(config.recordStatusLabels).map(([value, label]) => ({ value: `record-${value}`, label })),
  ];
}

// Una línea por alumno: "222000001", "222000001 92.35", "222000001, 92,35" o copiada de Excel (tabulador).
const LINE_WITH_AVERAGE = /^(\S+?)[\s,;]+(\d{1,3}(?:[.,]\d{1,2})?)$/;

export function parseStudentList(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(LINE_WITH_AVERAGE);
      if (match) return { academic_id: match[1], average: Number(match[2].replace(',', '.')) };
      return { academic_id: line.split(/[\s,;]+/)[0], average: null };
    });
}

export const formatAverage = (value) => (value == null ? '—' : Number(value).toFixed(2));

// Documentos obligatorios de inscripción: 'none' (no se piden), 'missing', 'corrections' (alguno con
// observaciones que el alumno debe corregir), 'review' (todos subidos, falta aprobar) o 'complete'.
export function documentsState(progress) {
  if (!progress || progress.required === 0) return 'none';
  if (progress.complete) return 'complete';
  if (progress.all_submitted) return 'review';
  if (progress.rejected > 0) return 'corrections';
  return 'missing';
}
