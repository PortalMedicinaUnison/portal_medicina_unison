import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { PROGRAMS } from '../utils/constants';

// ----------------- Catálogo de documentos (por programa y etapa) ----------------

// params: { program, stage, include_inactive }
export const getDocumentRequirementsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.DOCUMENT_REQUIREMENTS.LIST, { params });

// data: { program, stage, name, description, is_required, allows_multiple, validity_months, sort_order }
export const createDocumentRequirementRequest = (data) =>
  api.post(API_ENDPOINTS.DOCUMENT_REQUIREMENTS.LIST, data);

export const updateDocumentRequirementRequest = (id, data) =>
  api.patch(API_ENDPOINTS.DOCUMENT_REQUIREMENTS.DETAIL(id), data);

// Lo retira del catálogo; los archivos ya subidos se conservan en los expedientes.
export const deleteDocumentRequirementRequest = (id) =>
  api.delete(API_ENDPOINTS.DOCUMENT_REQUIREMENTS.DETAIL(id));

// Formato descargable: PDF, Word, Excel u OpenDocument.
export const uploadRequirementTemplateRequest = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put(API_ENDPOINTS.DOCUMENT_REQUIREMENTS.TEMPLATE(id), formData);
};

export const deleteRequirementTemplateRequest = (id) =>
  api.delete(API_ENDPOINTS.DOCUMENT_REQUIREMENTS.TEMPLATE(id));

// Requiere el token: se descarga como Blob.
export const getRequirementTemplateRequest = (id) =>
  api.get(API_ENDPOINTS.DOCUMENT_REQUIREMENTS.TEMPLATE(id), { responseType: 'blob' });

// ----------------- Expediente de una asignación (internado o servicio social) ----------------

const applicationEndpoints = (program) => (
  Number(program) === PROGRAMS.INTERNSHIP
    ? API_ENDPOINTS.INTERNSHIP_APPLICATIONS
    : API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS
);

export const getExpedienteRequest = (program, applicationId) =>
  api.get(applicationEndpoints(program).DOCUMENTS(applicationId));

export const uploadExpedienteDocumentRequest = (program, applicationId, requirementId, file) => {
  const formData = new FormData();
  formData.append('requirement_id', String(requirementId));
  formData.append('file', file);
  return api.post(applicationEndpoints(program).DOCUMENTS(applicationId), formData);
};

export const deleteExpedienteDocumentRequest = (program, applicationId, documentId) =>
  api.delete(applicationEndpoints(program).DOCUMENT(applicationId, documentId));

export const getExpedienteDocumentFileRequest = (program, applicationId, documentId, { download = false } = {}) =>
  api.get(`${applicationEndpoints(program).DOCUMENT(applicationId, documentId)}/file`, {
    params: { download },
    responseType: 'blob',
  });

// data: { review_status, review_comment }
export const reviewExpedienteDocumentRequest = (program, applicationId, documentId, data) =>
  api.patch(`${applicationEndpoints(program).DOCUMENT(applicationId, documentId)}/review`, data);
