import { ROUTES, adminAbs } from '../../../config';
import { withProgram } from '../../../utils/programParams';

// Catálogo de documentos de un programa (pantalla única; el menú de cada programa la abre con ?program=).
export const documentRequirementsPath = (program) => withProgram(adminAbs(ROUTES.ADMIN.DOCUMENT_REQUIREMENTS), program);
