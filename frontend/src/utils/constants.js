export const SONORA_MUNICIPALITIES = [
    "Aconchi", "Agua Prieta", "Álamos", "Altar", "Arivechi", "Arizpe",
    "Atil", "Bacadéhuachi", "Bacanora", "Bacerac", "Bacoachi", "Bácum",
    "Banámichi", "Baviácora", "Bavispe", "Benito Juárez", "Benjamín Hill",
    "Caborca", "Cajeme", "Cananea", "Carbó", "Casa Grande",
    "Cucurpe", "Cumpas", "Divisaderos", "Empalme", "Etchojoa", "Fronteras",
    "General Plutarco Elías Calles", "Granados", "Guaymas", "Hermosillo",
    "Huachinera", "Huásabas", "Huatabampo", "Huépac", "Imuris", "La Colorada",
    "Magdalena", "Mazatán", "Moctezuma", "Naco", "Nácori Chico", "Nacozari de García",
    "Navojoa", "Nogales", "Onavas", "Opodepe", "Oquitoa", "Pitiquito", "Puerto Peñasco",
    "Quiriego", "Rayón", "Rosario", "Sahuaripa", "San Felipe de Jesús",
    "San Ignacio Río Muerto", "San Javier", "San Luis Río Colorado", "San Miguel de Horcasitas",
    "San Pedro de la Cueva", "Santa Ana", "Santa Cruz", "Sáric", "Soyopa",
    "Suaqui Grande", "Tepache", "Trincheras", "Tubutama", "Ures", "Villa Hidalgo",
    "Villa Pesqueira", "Yécora"
];

// ---------------------- ENUMS DEL BACKEND ----------------------
// Deben coincidir con los IntEnum de backend/app/models. Úsalos en lugar de mapas locales.

export const APPLICATION_STATUS = { PENDING: 1, ACCEPTED: 2, DECLINED: 3 };
export const APPLICATION_STATUS_LABELS = { 1: 'Pendiente', 2: 'Aceptada', 3: 'Declinada' };

export const INTERNSHIP_STATUS = { ACTIVE: 1, SUSPENDED: 2, FINISHED: 3 };
export const INTERNSHIP_STATUS_LABELS = { 1: 'Activo', 2: 'Suspendido', 3: 'Finalizado' };

export const REPORT_TYPES = {
  ACCIDENT: 1, INSECURE_CONDITION: 2, WORK_HARASSMENT: 3, SEXUAL_HARASSMENT: 4,
  DISCRIMINATION: 5, ROBBERY: 6, OTHER: 7,
};
export const REPORT_TYPE_LABELS = {
  1: 'Accidente', 2: 'Condiciones inseguras', 3: 'Acoso laboral', 4: 'Acoso sexual',
  5: 'Discriminación', 6: 'Robo o hurto', 7: 'Otro',
};

export const ANNOUNCEMENT_TYPES = { GENERAL: 1, INTERNSHIP: 2 };
export const ANNOUNCEMENT_TYPE_LABELS = { 1: 'General', 2: 'Internado' };

export const PERIOD_LABELS = { 1: 'Primer periodo', 2: 'Segundo periodo' };

export const ROLE_LABELS = { student: 'Estudiante', admin: 'Administrador', super_admin: 'Super administrador' };

export const labelOf = (labels, value, fallback = 'Desconocido') => labels[Number(value)] ?? labels[value] ?? fallback;

// Programas que acredita el estudiante: primero el internado y después el servicio social.
export const PROGRAMS = { INTERNSHIP: 1, SOCIAL_SERVICE: 2 };
export const PROGRAM_LABELS = { 1: 'Internado', 2: 'Servicio social' };

export const SOCIAL_SERVICE_STATUS = { ACTIVE: 1, SUSPENDED: 2, FINISHED: 3 };
export const SOCIAL_SERVICE_STATUS_LABELS = { 1: 'Activo', 2: 'Suspendido', 3: 'Liberado' };

// Expediente: etapas del catálogo de documentos y revisión de cada archivo.
export const DOCUMENT_STAGES = { INSCRIPTION: 1, IN_PROGRESS: 2, COMPLETION: 3 };
export const DOCUMENT_STAGE_LABELS = { 1: 'Inscripción', 2: 'Durante el programa', 3: 'Término o liberación' };
// Nombre de cada etapa según el programa (internado / servicio social).
export const DOCUMENT_STAGE_LABELS_BY_PROGRAM = {
  1: { 1: 'Inscripción', 2: 'Durante el internado', 3: 'Término del internado' },
  2: { 1: 'Inscripción', 2: 'Durante el servicio social', 3: 'Liberación' },
};

export const REVIEW_STATUS = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
export const REVIEW_STATUS_LABELS = { 1: 'En revisión', 2: 'Aprobado', 3: 'Con observaciones' };
