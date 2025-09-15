import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const createSiteRequest = (siteData) =>
  api.post(API_ENDPOINTS.SITES.CREATE, siteData);

export const getSiteByIdRequest = (id) =>
  api.get(API_ENDPOINTS.SITES.GET(id));

export const updateSiteRequest = (id, data) =>
  api.put(API_ENDPOINTS.SITES.UPDATE(id), data);

export const deleteSiteRequest = (id) =>
  api.delete(API_ENDPOINTS.SITES.DELETE(id));

export const getAllSitesRequest = () =>
  api.get(API_ENDPOINTS.SITES.GET_ALL);

// ------------ Institutions ------------

export const createInstitutionRequest = (institutionData) =>
  api.post(API_ENDPOINTS.INSTITUTIONS.CREATE, institutionData);

export const getInstitutionByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INSTITUTIONS.GET(id));

export const updateInstitutionRequest = (id, data) =>
  api.put(API_ENDPOINTS.INSTITUTIONS.UPDATE(id), data);

export const deleteInstitutionRequest = (id) =>
  api.delete(API_ENDPOINTS.INSTITUTIONS.DELETE(id));

export const getAllInstitutionsRequest = () =>
  api.get(API_ENDPOINTS.INSTITUTIONS.GET_ALL);