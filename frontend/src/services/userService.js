import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';


export const createUserRequest = (userData) =>
  api.post(API_ENDPOINTS.USERS.CREATE, userData);

export const getAllUsersRequest = () =>
  api.get(API_ENDPOINTS.USERS.GET_ALL);

export const getUserByAcademicIdRequest = (academicId) =>
  api.get(API_ENDPOINTS.USERS.GET_BY_ACADEMIC_ID(academicId));

export const getUserByIdRequest = (id) =>
  api.get(API_ENDPOINTS.USERS.GET(id));

export const updateUserRequest = (id, data) =>
  api.patch(API_ENDPOINTS.USERS.UPDATE(id), data);

export const deleteUserRequest = (id) =>
  api.delete(API_ENDPOINTS.USERS.DELETE(id));

// ----------------- User Enrollment ----------------

export const createUserEnrollmentRequest = (enrollmentData) =>
  api.post(API_ENDPOINTS.USER_ENROLLMENTS.CREATE, enrollmentData);

export const getAllUserEnrollmentsRequest = () =>
  api.get(API_ENDPOINTS.USER_ENROLLMENTS.GET_ALL);

export const getUserEnrollmentByIdRequest = (id) =>
  api.get(API_ENDPOINTS.USER_ENROLLMENTS.GET(id));

export const updateUserEnrollmentRequest = (id, data) =>
  api.patch(API_ENDPOINTS.USER_ENROLLMENTS.UPDATE(id), data);

export const deleteUserEnrollmentRequest = (id) =>
  api.delete(API_ENDPOINTS.USER_ENROLLMENTS.DELETE(id));