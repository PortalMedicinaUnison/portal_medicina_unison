import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ----------------- Promociones ----------------

export const createPromotionRequest = (promotionData) =>
  api.post(API_ENDPOINTS.PROMOTIONS.LIST, promotionData);

// params: { program, year, period, is_finished }
export const getAllPromotionsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.PROMOTIONS.LIST, { params });

export const getPromotionByIdRequest = (id) =>
  api.get(API_ENDPOINTS.PROMOTIONS.DETAIL(id));

// data: { start_date, end_date, is_finished, seats: [{ site_id, capacity }] } (todo opcional);
// fechas y cupos se guardan todo o nada.
export const updatePromotionRequest = (id, data) =>
  api.patch(API_ENDPOINTS.PROMOTIONS.DETAIL(id), data);

export const deletePromotionRequest = (id) =>
  api.delete(API_ENDPOINTS.PROMOTIONS.DETAIL(id));

// ----------------- Cupos por sede (promotion site details) ----------------

// params: { promotion_id, site_id }. Cada cupo incluye `occupied` (lugares ya asignados).
export const getAllPsdsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.PSD.LIST, { params });

export const getPsdsByPromotionIdRequest = (promotionId) =>
  getAllPsdsRequest({ promotion_id: promotionId });
