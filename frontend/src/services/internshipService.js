import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// Los estudiantes solo reciben sus propios datos (el backend filtra por la sesión),
// ordenados del más reciente al más antiguo.

// ----------------- Asignaciones (internship applications) ----------------

export const createInternshipApplicationRequest = (data) =>
  api.post(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.LIST, data);

// params: { promotion_id, academic_id, status }
export const getAllInternshipApplicationsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.LIST, { params });

export const getInternshipApplicationByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.DETAIL(id));

// Acepta la asignación: crea el internado en la misma operación. Devuelve el internado.
export const acceptInternshipApplicationRequest = (id) =>
  api.post(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.ACCEPT(id));

export const declineInternshipApplicationRequest = (id) =>
  api.post(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.DECLINE(id));

export const deleteInternshipApplicationRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.DETAIL(id));

// ----------------- Internados ----------------

// params: { promotion_id, site_id, academic_id, status }
export const getAllInternshipsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.LIST, { params });

export const getInternshipByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.DETAIL(id));

// data: { site_id, status }. La sede debe tener cupo en la promoción.
export const updateInternshipRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIPS.DETAIL(id), data);

export const deleteInternshipRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIPS.DETAIL(id));

// ----------------- Documentos del internado ----------------

// formData: FormData con `document_type` y `file` (PDF).
export const createInternshipDocumentRequest = (internshipId, formData) =>
  api.post(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.LIST(internshipId), formData);

export const getDocumentsByInternshipRequest = (internshipId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.LIST(internshipId));

export const getInternshipDocumentByIdRequest = (internshipId, docId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.DETAIL(internshipId, docId));

export const deleteInternshipDocumentRequest = (internshipId, docId) =>
  api.delete(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.DETAIL(internshipId, docId));

// El archivo requiere el token, así que se descarga como Blob (no sirve un enlace directo).
export const getInternshipDocumentFileRequest = (internshipId, docId, { download = false } = {}) =>
  api.get(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.FILE(internshipId, docId), {
    params: { download },
    responseType: 'blob',
  });
