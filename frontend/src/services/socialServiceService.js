import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// Servicio social: mismo flujo que el internado. Los estudiantes solo reciben sus propios datos
// (el backend filtra por la sesión), del más reciente al más antiguo.

// ----------------- Asignaciones de servicio social ----------------

// Requiere que el estudiante haya acreditado (finalizado) el internado.
export const createSocialServiceApplicationRequest = (data) =>
  api.post(API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS.LIST, data);

// params: { promotion_id, academic_id, status }
export const getAllSocialServiceApplicationsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS.LIST, { params });

export const getSocialServiceApplicationByIdRequest = (id) =>
  api.get(API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS.DETAIL(id));

// Acepta la asignación: crea el servicio social en la misma operación. Devuelve el servicio social.
export const acceptSocialServiceApplicationRequest = (id) =>
  api.post(API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS.ACCEPT(id));

export const declineSocialServiceApplicationRequest = (id) =>
  api.post(API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS.DECLINE(id));

export const deleteSocialServiceApplicationRequest = (id) =>
  api.delete(API_ENDPOINTS.SOCIAL_SERVICE_APPLICATIONS.DETAIL(id));

// ----------------- Servicios sociales ----------------

// params: { promotion_id, site_id, academic_id, status }
export const getAllSocialServicesRequest = (params = {}) =>
  api.get(API_ENDPOINTS.SOCIAL_SERVICES.LIST, { params });

export const getSocialServiceByIdRequest = (id) =>
  api.get(API_ENDPOINTS.SOCIAL_SERVICES.DETAIL(id));

// data: { site_id, status }. La plaza debe tener cupo en la promoción.
export const updateSocialServiceRequest = (id, data) =>
  api.patch(API_ENDPOINTS.SOCIAL_SERVICES.DETAIL(id), data);

export const deleteSocialServiceRequest = (id) =>
  api.delete(API_ENDPOINTS.SOCIAL_SERVICES.DETAIL(id));
