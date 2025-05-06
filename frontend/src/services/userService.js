import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const createUser = (userData) =>
  api.post(API_ENDPOINTS.USERS.CREATE, userData);

export const getUserById = (id, token) =>
  api.get(API_ENDPOINTS.USERS.GET(id), {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateUser = (id, data, token) =>
  api.put(API_ENDPOINTS.USERS.UPDATE(id), data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteUser = (id, token) =>
  api.delete(API_ENDPOINTS.USERS.DELETE(id), {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getAllUsers = (token) =>
  api.get(API_ENDPOINTS.USERS.LIST, {
    headers: { Authorization: `Bearer ${token}` }
  });
