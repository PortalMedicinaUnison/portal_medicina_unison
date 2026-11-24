import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ----------------- Usuario en sesión ----------------

export const getMeRequest = () =>
  api.get(API_ENDPOINTS.USERS.ME);

export const updateMeRequest = (data) =>
  api.patch(API_ENDPOINTS.USERS.ME, data);

// Devuelve { access_token }: las demás sesiones se cierran y esta sigue con el token nuevo.
export const changeMyPasswordRequest = (data) =>
  api.put(API_ENDPOINTS.USERS.ME_PASSWORD, data);

export const acceptPrivacyNoticeRequest = () =>
  api.post(API_ENDPOINTS.USERS.ME_PRIVACY_NOTICE_ACCEPT);

export const deactivateMeRequest = () =>
  api.delete(API_ENDPOINTS.USERS.ME);

// Foto de perfil (JPEG, PNG o WebP de hasta 2 MB).
export const uploadMyPhotoRequest = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put(API_ENDPOINTS.USERS.ME_PHOTO, formData);
};

export const deleteMyPhotoRequest = () =>
  api.delete(API_ENDPOINTS.USERS.ME_PHOTO);

// La foto requiere el token, así que se descarga como Blob (no sirve como src directo de <img>).
export const getUserPhotoRequest = (id) =>
  api.get(API_ENDPOINTS.USERS.PHOTO(id), { responseType: 'blob' });

// ----------------- Administración de usuarios ----------------

// params: { is_admin, academic_id, q, include_inactive }
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

export const reactivateUserRequest = (id) =>
  api.post(API_ENDPOINTS.USERS.REACTIVATE(id));

// Enlace de un solo uso para que el usuario cree una contraseña nueva: { token, expires_at }.
export const createPasswordResetLinkRequest = (id) =>
  api.post(API_ENDPOINTS.USERS.PASSWORD_RESET(id));

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
