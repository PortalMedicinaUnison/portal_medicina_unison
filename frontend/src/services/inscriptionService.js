import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { PROGRAMS } from '../utils/constants';

// Inscripciones (asignaciones) de internado o servicio social con la misma interfaz.
const endpoints = (program) => (
  Number(program) === PROGRAMS.INTERNSHIP
    ? { app: API_ENDPOINTS.INTERNSHIP_APPLICATIONS, record: API_ENDPOINTS.INTERNSHIPS }
    : { app: API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS, record: API_ENDPOINTS.SOCIAL_SERVICES }
);

// params: { promotion_id, academic_id, status }
export const getInscriptionsRequest = (program, params = {}) =>
  api.get(endpoints(program).app.LIST, { params });

export const getInscriptionRequest = (program, id) =>
  api.get(endpoints(program).app.DETAIL(id));

// data: { average }
export const updateInscriptionRequest = (program, id, data) =>
  api.patch(endpoints(program).app.DETAIL(id), data);

export const deleteInscriptionRequest = (program, id) =>
  api.delete(endpoints(program).app.DETAIL(id));

export const getCandidatesRequest = (program, promotionId) =>
  api.get(`${endpoints(program).app.LIST}/candidates`, { params: { promotion_id: promotionId } });

// students: [{ academic_id, average? }]
export const bulkAssignRequest = (program, promotionId, students) =>
  api.post(`${endpoints(program).app.LIST}/bulk`, { promotion_id: promotionId, students });

// results: [{ application_id, site_id }] en el orden del acto.
export const recordPlazaResultsRequest = (program, results) =>
  api.post(`${endpoints(program).app.LIST}/plaza-results`, { results });

// Internado o servicio social (el "registro" del programa una vez aceptada la asignación).
export const getProgramRecordRequest = (program, id) =>
  api.get(endpoints(program).record.DETAIL(id));

// data: { site_id, status }
export const updateProgramRecordRequest = (program, id, data) =>
  api.patch(endpoints(program).record.DETAIL(id), data);

export const deleteProgramRecordRequest = (program, id) =>
  api.delete(endpoints(program).record.DETAIL(id));
