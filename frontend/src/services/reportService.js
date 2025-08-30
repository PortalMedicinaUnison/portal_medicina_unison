import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// ------------ Reports (Usuarios) ------------

export const createReportRequest = (reportData, studentId) =>
  api.post(API_ENDPOINTS.REPORTS.CREATE, reportData, { params: { student_id: studentId } });

export const getReportByIdRequest = (id, studentId) =>
  api.get(API_ENDPOINTS.REPORTS.GET(id), { params: { student_id: studentId } });

export const getAllReportsRequest = (studentId) =>
  api.get(API_ENDPOINTS.REPORTS.GET_ALL, { params: { student_id: studentId } });

export const updateReportRequest = (id, data, studentId) =>
  api.patch(API_ENDPOINTS.REPORTS.UPDATE(id), data, { params: { student_id: studentId } });

export const toggleReportStatusRequest = (id, studentId) =>
  api.patch(API_ENDPOINTS.REPORTS.TOGGLE_STATUS(id), {}, { params: { student_id: studentId } });

export const getReportsByInternshipRequest = (internshipId, studentId) =>
  api.get(API_ENDPOINTS.REPORTS.GET_BY_INTERNSHIP(internshipId), { params: { student_id: studentId } });

export const getReportsBySiteRequest = (siteId, studentId) =>
  api.get(API_ENDPOINTS.REPORTS.GET_BY_SITE(siteId), { params: { student_id: studentId } });

// ------------ Reports (Administradores) ------------

export const getAllReportsAdminRequest = () =>
  api.get(API_ENDPOINTS.ADMIN_REPORTS.GET_ALL);

export const getOpenReportsAdminRequest = () =>
  api.get(API_ENDPOINTS.ADMIN_REPORTS.GET_OPEN);

export const getClosedReportsAdminRequest = () =>
  api.get(API_ENDPOINTS.ADMIN_REPORTS.GET_CLOSED);

export const addAdminCommentRequest = (id, adminComment) =>
  api.patch(API_ENDPOINTS.ADMIN_REPORTS.ADD_COMMENT(id), { admin_comment: adminComment });
