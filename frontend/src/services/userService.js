import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const createUserRequest = (userData) =>
  api.post(API_ENDPOINTS.USERS.CREATE, userData);

export const getUserByIdRequest = (id) =>
  api.get(API_ENDPOINTS.USERS.GET(id));

export const updateUserRequest = (id, data) =>
  api.put(API_ENDPOINTS.USERS.UPDATE(id), data);

export const deleteUserRequest = (id) =>
  api.delete(API_ENDPOINTS.USERS.DELETE(id));

export const getAllUsersRequest = () =>
  api.get(API_ENDPOINTS.USERS.LIST);
