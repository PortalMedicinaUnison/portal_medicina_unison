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

export const createInternshipApplicationRequest = (data) =>
  api.post(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.CREATE, data);

export const getInternshipApplicationByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET(id));

export const getInternshipApplicationsByStudentRequest = (studentId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET_BY_STUDENT(studentId));

export const getInternshipApplicationsByStatusRequest = (isAccepted) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET_BY_STATUS(isAccepted));

export const getAllInternshipApplicationsRequest = () =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET_ALL);

export const updateInternshipApplicationRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.UPDATE(id), data);

export const deleteInternshipApplicationRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.DELETE(id));

// ------------ Internship Documents ------------

export const createInternshipDocumentRequest = (data) =>
  api.post(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.CREATE, data);

export const getInternshipDocumentByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.GET(id));

export const getDocumentsByInternshipRequest = (internshipId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.GET_BY_INTERNSHIP(internshipId));

export const updateInternshipDocumentRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.UPDATE(id), data);

export const deleteInternshipDocumentRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.DELETE(id));
