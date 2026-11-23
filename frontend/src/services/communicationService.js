import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// Los estudiantes solo reciben avisos visibles y encuestas visibles y vigentes.

// ----------------- Avisos ----------------

export const createAnnouncementRequest = (announcementData) =>
  api.post(API_ENDPOINTS.ANNOUNCEMENTS.LIST, announcementData);

// params: { is_visible, announcement_type }
export const getAllAnnouncementsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.ANNOUNCEMENTS.LIST, { params });

export const getAnnouncementByIdRequest = (id) =>
  api.get(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(id));

export const updateAnnouncementRequest = (id, data) =>
  api.patch(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(id), data);

export const deleteAnnouncementRequest = (id) =>
  api.delete(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(id));

// ----------------- Encuestas ----------------

export const createSurveyRequest = (surveyData) =>
  api.post(API_ENDPOINTS.SURVEYS.LIST, surveyData);

// params: { is_visible, mandatory }
export const getAllSurveysRequest = (params = {}) =>
  api.get(API_ENDPOINTS.SURVEYS.LIST, { params });

export const getSurveyByIdRequest = (id) =>
  api.get(API_ENDPOINTS.SURVEYS.DETAIL(id));

export const updateSurveyRequest = (id, data) =>
  api.patch(API_ENDPOINTS.SURVEYS.DETAIL(id), data);

export const deleteSurveyRequest = (id) =>
  api.delete(API_ENDPOINTS.SURVEYS.DETAIL(id));
