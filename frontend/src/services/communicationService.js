import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ---------------------- ANNOUNCEMENT ----------------------

export const createAnnouncementRequest = (announcementData) =>
    api.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, announcementData);

export const getAllAnnouncementsRequest = () =>
    api.get(API_ENDPOINTS.ANNOUNCEMENTS.GET_ALL);

export const getAnnouncementByIdRequest = (id) =>
    api.get(API_ENDPOINTS.ANNOUNCEMENTS.GET(id));

export const updateAnnouncementRequest = (id, data) =>
    api.patch(API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(id), data);

export const deleteAnnouncementRequest = (id) =>
    api.delete(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(id));

// ---------------------- SURVEY ----------------------

export const createSurveyRequest = (surveyData) =>
    api.post(API_ENDPOINTS.SURVEYS.CREATE, surveyData);

export const getSurveyByIdRequest = (id) =>
    api.get(API_ENDPOINTS.SURVEYS.GET(id));

export const updateSurveyRequest = (id, data) =>
    api.patch(API_ENDPOINTS.SURVEYS.UPDATE(id), data);

export const deleteSurveyRequest = (id) =>
    api.delete(API_ENDPOINTS.SURVEYS.DELETE(id));

export const getAllSurveysRequest = () =>
    api.get(API_ENDPOINTS.SURVEYS.GET_ALL);
