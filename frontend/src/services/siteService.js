import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ----------------- Sedes ----------------

export const createSiteRequest = (siteData) =>
  api.post(API_ENDPOINTS.SITES.LIST, siteData);

// params: { institution_id, city, program } (program: 1 sedes de internado, 2 de servicio social)
export const getAllSitesRequest = (params = {}) =>
  api.get(API_ENDPOINTS.SITES.LIST, { params });

export const getSiteByIdRequest = (id) =>
  api.get(API_ENDPOINTS.SITES.DETAIL(id));

export const updateSiteRequest = (id, data) =>
  api.patch(API_ENDPOINTS.SITES.DETAIL(id), data);

export const deleteSiteRequest = (id) =>
  api.delete(API_ENDPOINTS.SITES.DETAIL(id));

// ----------------- Instituciones ----------------

export const createInstitutionRequest = (institutionData) =>
  api.post(API_ENDPOINTS.INSTITUTIONS.LIST, institutionData);

export const getAllInstitutionsRequest = () =>
  api.get(API_ENDPOINTS.INSTITUTIONS.LIST);

export const getInstitutionByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INSTITUTIONS.DETAIL(id));

export const updateInstitutionRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INSTITUTIONS.DETAIL(id), data);

export const deleteInstitutionRequest = (id) =>
  api.delete(API_ENDPOINTS.INSTITUTIONS.DETAIL(id));
