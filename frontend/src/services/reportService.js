import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ------------ Reports ------------

export const createReportRequest = (reportData, ) =>
  api.post(API_ENDPOINTS.REPORTS.CREATE, reportData);

export const getAllReportsRequest = () =>
  api.get(API_ENDPOINTS.REPORTS.GET_ALL);

export const getReportByIdRequest = (id) =>
  api.get(API_ENDPOINTS.REPORTS.GET(id));

export const updateReportRequest = (id, data) =>
  api.patch(API_ENDPOINTS.REPORTS.UPDATE(id), data);

export const getReportsByStudentRequest = (studentId) =>
  api.get(API_ENDPOINTS.REPORTS.GET_BY_STUDENT(studentId));

export const getReportsByInternshipRequest = (internshipId) =>
  api.get(API_ENDPOINTS.REPORTS.GET_BY_INTERNSHIP(internshipId));

export const getReportsBySiteRequest = (siteId) =>
  api.get(API_ENDPOINTS.REPORTS.GET_BY_SITE(siteId));

export const deleteReportRequest = (id) =>
  api.delete(API_ENDPOINTS.REPORTS.DELETE(id));

export const uploadEvidenceRequest = (reportId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(
    API_ENDPOINTS.REPORTS.UPLOAD_EVIDENCE(reportId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};