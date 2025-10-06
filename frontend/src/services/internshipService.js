import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ------------ Internships ------------

export const createInternshipRequest = (data) =>
  api.post(API_ENDPOINTS.INTERNSHIPS.CREATE, data);

export const getAllInternshipsRequest = () =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET_ALL);

export const getInternshipByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET(id));

export const getInternshipsByAcademicRequest = (academicId) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET_BY_ACADEMIC(academicId));

export const getInternshipsBySiteRequest = (siteId) =>
  api.get(API_ENDPOINTS.INTERNSHIPS.GET_BY_SITE(siteId));

export const updateInternshipRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIPS.UPDATE(id), data);

export const deleteInternshipRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIPS.DELETE(id));

// ------------ Internship Application ------------

export const createInternshipApplicationRequest = (data) =>
  api.post(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.CREATE, data);

export const getAllInternshipApplicationsRequest = () =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET_ALL);

export const getInternshipApplicationByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET(id));

export const getInternshipApplicationsByAcademicRequest = (academicId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET_BY_ACADEMIC(academicId));

export const getInternshipApplicationsLatestByAcademicRequest = (academicId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET_LATEST_BY_ACADEMIC(academicId));

export const getInternshipApplicationForUpdateByIdRequest = (id) =>
  api.get(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.GET_FOR_UPDATE(id));

export const updateInternshipApplicationRequest = (id, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.UPDATE(id), data);

export const updateAcceptInternshipApplicationRequest = (id) =>
  api.post(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.UPDATE_ACCEPT(id));

export const deleteInternshipApplicationRequest = (id) =>
  api.delete(API_ENDPOINTS.INTERNSHIP_APPLICATIONS.DELETE(id));

// ------------ Internship Documents ------------

export const createInternshipDocumentRequest = (internshipId, data) =>
  api.post(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.CREATE(internshipId), data);

export const getInternshipDocumentByIdRequest = (internshipId, docId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.GET(internshipId, docId));

export const getDocumentsByInternshipRequest = (internshipId) =>
  api.get(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.GET_ALL(internshipId));

export const updateInternshipDocumentRequest = (internshipId, docId, data) =>
  api.patch(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.UPDATE(internshipId, docId), data);

export const deleteInternshipDocumentRequest = (internshipId, docId) =>
  api.delete(API_ENDPOINTS.INTERNSHIP_DOCUMENTS.DELETE(internshipId, docId));
