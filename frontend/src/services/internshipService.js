import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ------------ Internships ------------

export const createInternshipRequest = (data) =>
  api.post(API_ENDPOINTS.INTERNSHIPS.CREATE, data);

export const getInternshipByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET(id));

export const getAllInternshipsRequest = () =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET_ALL);

export const getInternshipsByStudentRequest = (studentId) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET_BY_STUDENT(studentId));

export const getInternshipsBySiteRequest = (siteId) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET_BY_SITE(siteId));

export const updateInternshipRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIPS.UPDATE(id), data);

export const deleteInternshipRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIPS.DELETE(id));


// ------------ Internship Enrollments ------------

export const createEnrollmentRequest = (data) =>
  api.post(API_ENDPOINTS.ENROLLMENTS.CREATE, data);

export const getEnrollmentByIdRequest = (id) =>
  api.get(API_ENDPOINTS.ENROLLMENTS.GET(id));

export const getEnrollmentsByStudentRequest = (studentId) =>
  api.get(API_ENDPOINTS.ENROLLMENTS.GET_BY_STUDENT(studentId));

export const getEnrollmentsByStatusRequest = (isAccepted) =>
  api.get(API_ENDPOINTS.ENROLLMENTS.GET_BY_STATUS(isAccepted));

export const getAllEnrollmentsRequest = () =>
  api.get(API_ENDPOINTS.ENROLLMENTS.GET_ALL);

export const updateEnrollmentRequest = (id, data) =>
  api.patch(API_ENDPOINTS.ENROLLMENTS.UPDATE(id), data);

export const deleteEnrollmentRequest = (id) =>
  api.delete(API_ENDPOINTS.ENROLLMENTS.DELETE(id));


// ------------ Internship Documents ------------

export const createInternshipDocumentRequest = (data) =>
  api.post(API_ENDPOINTS.INTERNSHIPS_DOCUMENTS.CREATE, data);

export const getInternshipDocumentByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIPS_DOCUMENTS.GET(id));

export const getDocumentsByInternshipRequest = (internshipId) =>
  api.get(API_ENDPOINTS.INTERNSHIPS_DOCUMENTS.GET_BY_INTERNSHIP(internshipId));

export const updateInternshipDocumentRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIPS_DOCUMENTS.UPDATE(id), data);

export const deleteInternshipDocumentRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIPS_DOCUMENTS.DELETE(id));
