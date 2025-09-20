import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

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
