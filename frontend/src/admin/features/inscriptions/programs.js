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
  const label = recordStatus === 1 ? 'En curso' : (config.recordStatusLabels[recordStatus] ?? 'Desconocido');
  return { key: `record-${recordStatus}`, label };
}

export function statusFilterOptions(config) {
  return [
    { value: 'pending', label: 'Por aceptar' },
    { value: 'declined', label: 'Declinó' },
    ...Object.entries(config.recordStatusLabels).map(([value, label]) => ({
      value: `record-${value}`, label: Number(value) === 1 ? 'En curso' : label,
    })),
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

// Documentos obligatorios de inscripción: 'none' (no se piden), 'missing', 'review' o 'complete'.
export function documentsState(progress) {
  if (!progress || progress.required === 0) return 'none';
  if (progress.complete) return 'complete';
  if (progress.all_submitted) return 'review';
  return 'missing';
}
