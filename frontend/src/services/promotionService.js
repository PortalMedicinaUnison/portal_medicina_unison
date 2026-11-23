import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ----------------- Promociones ----------------

export const createPromotionRequest = (promotionData) =>
  api.post(API_ENDPOINTS.PROMOTIONS.LIST, promotionData);

// params: { year, period, is_finished }
export const getAllPromotionsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.PROMOTIONS.LIST, { params });

export const getPromotionByIdRequest = (id) =>
  api.get(API_ENDPOINTS.PROMOTIONS.DETAIL(id));

export const updatePromotionRequest = (id, data) =>
  api.patch(API_ENDPOINTS.PROMOTIONS.DETAIL(id), data);

export const deletePromotionRequest = (id) =>
  api.delete(API_ENDPOINTS.PROMOTIONS.DETAIL(id));

// ----------------- Cupos por sede (promotion site details) ----------------

export const createPsdRequest = (psdData) =>
  api.post(API_ENDPOINTS.PSD.LIST, psdData);

// params: { promotion_id, site_id }. Cada cupo incluye `occupied` (internos ya asignados).
export const getAllPsdsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.PSD.LIST, { params });

export const getPsdsByPromotionIdRequest = (promotionId) =>
  getAllPsdsRequest({ promotion_id: promotionId });

export const getPsdByIdRequest = (id) =>
  api.get(API_ENDPOINTS.PSD.DETAIL(id));

export const updatePsdRequest = (id, data) =>
  api.patch(API_ENDPOINTS.PSD.DETAIL(id), data);

export const deletePsdRequest = (id) =>
  api.delete(API_ENDPOINTS.PSD.DETAIL(id));
