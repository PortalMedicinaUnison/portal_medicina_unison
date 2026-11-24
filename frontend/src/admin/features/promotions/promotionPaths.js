import { ROUTES, adminAbs } from '../../../config';
import { withProgram } from '../../../utils/programParams';

// Lista y alta de promociones de un programa (sin programa, la lista muestra ambos).
export const promotionListPath = (program) => withProgram(adminAbs(ROUTES.ADMIN.PROMOTION_LIST), program);
export const promotionCreatePath = (program) => withProgram(adminAbs(ROUTES.ADMIN.PROMOTION_CREATE), program);
