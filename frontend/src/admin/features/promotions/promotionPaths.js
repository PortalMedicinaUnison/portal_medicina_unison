import { ROUTES, adminAbs } from '../../../config';
import { PROGRAM_LABELS } from '../../../utils/constants';

// Las promociones de cada programa son la misma pantalla filtrada con ?program= (1 internado, 2 servicio social).
const withProgram = (path, program) => (program ? `${path}?program=${program}` : path);

export const promotionListPath = (program) => withProgram(adminAbs(ROUTES.ADMIN.PROMOTION_LIST), program);
export const promotionCreatePath = (program) => withProgram(adminAbs(ROUTES.ADMIN.PROMOTION_CREATE), program);

// Programa válido de los parámetros de la URL, o null.
export function programFromParams(searchParams) {
  const value = searchParams.get('program');
  return PROGRAM_LABELS[value] ? Number(value) : null;
}
