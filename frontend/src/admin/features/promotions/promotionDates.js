import { PROGRAMS } from '../../../utils/constants';
import { todayISO } from '../../../utils/utils';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Inicio habitual (día 1 del mes): internado en enero o julio; servicio social en febrero o agosto.
export const USUAL_START_MONTHS = { [PROGRAMS.INTERNSHIP]: [1, 7], [PROGRAMS.SOCIAL_SERVICE]: [2, 8] };
export const USUAL_START_HINT = {
  [PROGRAMS.INTERNSHIP]: 'El internado suele iniciar el 1 de enero o el 1 de julio.',
  [PROGRAMS.SOCIAL_SERVICE]: 'El servicio social suele iniciar el 1 de febrero o el 1 de agosto.',
};

const pad = (n) => String(n).padStart(2, '0');
const parts = (value) => value.split('-').map(Number);
const semester = (value) => {
  const [year, month] = parts(value);
  return `${year}-${month <= 6 ? 1 : 2}`;
};

export const isISODate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''));

// "Próxima", "En curso", "Terminó (sin finalizar)" o "Finalizada", según sus fechas y si ya se cerró.
export function promotionStatus(promotion, today = todayISO()) {
  if (!promotion) return '—';
  if (promotion.is_finished) return 'Finalizada';
  if (promotion.start_date && today < promotion.start_date) return 'Próxima';
  if (promotion.end_date && today > promotion.end_date) return 'Terminó (sin finalizar)';
  return 'En curso';
}

// Último día de un programa de doce meses que empieza en `start` (igual que el backend).
export function oneYearAfter(start) {
  const [year, month, day] = parts(start);
  return new Date(Date.UTC(year + 1, month - 1, day - 1)).toISOString().slice(0, 10);
}

// "Jul 2026 – Jun 2027", como `label` del backend.
export function datesLabel(start, end) {
  if (!isISODate(start) || !isISODate(end)) return '';
  const [sy, sm] = parts(start);
  const [ey, em] = parts(end);
  return `${MONTHS[sm - 1]} ${sy} – ${MONTHS[em - 1]} ${ey}`;
}

// Hay una promoción por programa y semestre de inicio: ¿ya existe una que empiece en el de `start`?
export function semesterTaken(start, promotions, exceptId = null) {
  if (!isISODate(start)) return null;
  return promotions.find((p) => p.promotion_id !== exceptId && p.start_date && semester(p.start_date) === semester(start)) ?? null;
}

// Próximo inicio habitual a partir de hoy cuyo semestre no tenga ya una promoción del programa.
export function nextUsualStart(program, promotions = [], today = todayISO()) {
  const months = USUAL_START_MONTHS[program] ?? USUAL_START_MONTHS[PROGRAMS.INTERNSHIP];
  const [year] = parts(today);
  for (let y = year; y <= year + 5; y += 1) {
    for (const month of months) {
      const candidate = `${y}-${pad(month)}-01`;
      if (candidate >= today && !semesterTaken(candidate, promotions)) return candidate;
    }
  }
  return '';
}
