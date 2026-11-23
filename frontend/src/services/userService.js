import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ----------------- Usuario en sesión ----------------

export const getMeRequest = () =>
  api.get(API_ENDPOINTS.USERS.ME);

export const updateMeRequest = (data) =>
  api.patch(API_ENDPOINTS.USERS.ME, data);

export const changeMyPasswordRequest = (data) =>
  api.put(API_ENDPOINTS.USERS.ME_PASSWORD, data);

export const deactivateMeRequest = () =>
  api.delete(API_ENDPOINTS.USERS.ME);

// ----------------- Administración de usuarios ----------------

// params: { is_admin, academic_id, q }
export const getAllUsersRequest = (params = {}) =>
  api.get(API_ENDPOINTS.USERS.LIST, { params });

export const getUserByIdRequest = (id) =>
  api.get(API_ENDPOINTS.USERS.DETAIL(id));

export const updateUserRequest = (id, data) =>
  api.patch(API_ENDPOINTS.USERS.DETAIL(id), data);

export const setUserRoleRequest = (id, isAdmin) =>
  api.patch(API_ENDPOINTS.USERS.ROLE(id), { is_admin: isAdmin });

export const deleteUserRequest = (id) =>
  api.delete(API_ENDPOINTS.USERS.DETAIL(id));

// ----------------- Pre-registro (enrollments) ----------------

export const createUserEnrollmentRequest = (enrollmentData) =>
  api.post(API_ENDPOINTS.USER_ENROLLMENTS.LIST, enrollmentData);

export const bulkCreateUserEnrollmentsRequest = (academicIds) =>
  api.post(API_ENDPOINTS.USER_ENROLLMENTS.BULK, { academic_ids: academicIds });

// params: { academic_id, is_enrolled }
export const getAllUserEnrollmentsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.USER_ENROLLMENTS.LIST, { params });

export const getUserEnrollmentByIdRequest = (id) =>
  api.get(API_ENDPOINTS.USER_ENROLLMENTS.DETAIL(id));

export const updateUserEnrollmentRequest = (id, data) =>
  api.patch(API_ENDPOINTS.USER_ENROLLMENTS.DETAIL(id), data);

export const deleteUserEnrollmentRequest = (id) =>
  api.delete(API_ENDPOINTS.USER_ENROLLMENTS.DETAIL(id));
