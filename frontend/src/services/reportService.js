import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// El expediente y el internado del reporte los toma el backend de la sesión del estudiante.
export const createReportRequest = (reportData) =>
  api.post(API_ENDPOINTS.REPORTS.LIST, reportData);

// params: { academic_id, site_id, internship_id, is_open, report_type }.
// Para un estudiante el backend devuelve solo sus reportes.
export const getAllReportsRequest = (params = {}) =>
  api.get(API_ENDPOINTS.REPORTS.LIST, { params });

export const getMyReportsRequest = () =>
  getAllReportsRequest();

export const getReportByIdRequest = (id) =>
  api.get(API_ENDPOINTS.REPORTS.DETAIL(id));

// Solo el estudiante dueño, mientras el reporte siga abierto.
export const updateReportRequest = (id, data) =>
  api.patch(API_ENDPOINTS.REPORTS.DETAIL(id), data);

// Solo administración: abre o cierra el reporte.
export const setReportStatusRequest = (id, isOpen) =>
  api.patch(API_ENDPOINTS.REPORTS.STATUS(id), { is_open: isOpen });

export const deleteReportRequest = (id) =>
  api.delete(API_ENDPOINTS.REPORTS.DETAIL(id));
