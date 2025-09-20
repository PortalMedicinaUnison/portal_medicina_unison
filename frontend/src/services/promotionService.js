import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const createPromotionRequest = (PromotionData) =>
  api.post(API_ENDPOINTS.PROMOTIONS.CREATE, PromotionData);

export const getPromotionByIdRequest = (id) =>
  api.get(API_ENDPOINTS.PROMOTIONS.GET(id));

export const updatePromotionRequest = (id, data) =>
  api.patch(API_ENDPOINTS.PROMOTIONS.UPDATE(id), data);

export const deletePromotionRequest = (id) =>
  api.delete(API_ENDPOINTS.PROMOTIONS.DELETE(id));

export const getAllPromotionsRequest = () =>
  api.get(API_ENDPOINTS.PROMOTIONS.GET_ALL);

// ------------ PSD ------------

export const createPsdRequest = (PsdData) =>
  api.post(API_ENDPOINTS.PSD.CREATE, PsdData);

export const getPsdByIdRequest = (id) =>
  api.get(API_ENDPOINTS.PSD.GET(id));

export const updatePsdRequest = (id, data) =>
  api.patch(API_ENDPOINTS.PSD.UPDATE(id), data);

export const deletePsdRequest = (id) =>
  api.delete(API_ENDPOINTS.PSD.DELETE(id));

export const getAllPsdsRequest = () =>
  api.get(API_ENDPOINTS.PSD.GET_ALL);
