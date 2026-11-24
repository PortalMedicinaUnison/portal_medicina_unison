// Endpoints del backend. Las rutas identifican recursos ("/sites/3");
// los filtros se envían como query params desde los servicios (p. ej. { params: { site_id: 3 } }).
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PASSWORD_RESET_OPTIONS: '/auth/password-reset/options',
    PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
    PASSWORD_RESET_VERIFY: '/auth/password-reset/verify',
    PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm',
  },

  USERS: {
    LIST: '/users',
    ME: '/users/me',
    ME_PASSWORD: '/users/me/password',
    ME_PHOTO: '/users/me/photo',
    ME_PRIVACY_NOTICE_ACCEPT: '/users/me/privacy-notice/accept',
    DETAIL: (id) => `/users/${id}`,
    ROLE: (id) => `/users/${id}/role`,
    REACTIVATE: (id) => `/users/${id}/reactivate`,
    PASSWORD_RESET: (id) => `/users/${id}/password-reset`,
    PHOTO: (id) => `/users/${id}/photo`,
  },

  USER_ENROLLMENTS: {
    LIST: '/enrollments',
    BULK: '/enrollments/bulk',
    DETAIL: (id) => `/enrollments/${id}`,
  },

  INSTITUTIONS: {
    LIST: '/institutions',
    DETAIL: (id) => `/institutions/${id}`,
  },

  SITES: {
    LIST: '/sites',
    DETAIL: (id) => `/sites/${id}`,
  },

  PROMOTIONS: {
    LIST: '/promotions',
    DETAIL: (id) => `/promotions/${id}`,
  },

  PSD: {
    LIST: '/promotion-site-details',
    DETAIL: (id) => `/promotion-site-details/${id}`,
  },

  INTERNSHIP_APPLICATIONS: {
    LIST: '/internship-applications',
    DETAIL: (id) => `/internship-applications/${id}`,
    ACCEPT: (id) => `/internship-applications/${id}/accept`,
    DECLINE: (id) => `/internship-applications/${id}/decline`,
    DOCUMENTS: (id) => `/internship-applications/${id}/documents`,
    DOCUMENT: (id, docId) => `/internship-applications/${id}/documents/${docId}`,
  },

  INTERNSHIPS: {
    LIST: '/internships',
    DETAIL: (id) => `/internships/${id}`,
  },

  SOCIAL_SERVICE_APPLICATIONS: {
    LIST: '/social-service-applications',
    DETAIL: (id) => `/social-service-applications/${id}`,
    ACCEPT: (id) => `/social-service-applications/${id}/accept`,
    DECLINE: (id) => `/social-service-applications/${id}/decline`,
    DOCUMENTS: (id) => `/social-service-applications/${id}/documents`,
    DOCUMENT: (id, docId) => `/social-service-applications/${id}/documents/${docId}`,
  },

  SOCIAL_SERVICES: {
    LIST: '/social-services',
    DETAIL: (id) => `/social-services/${id}`,
  },

  // Catálogo de documentos por programa y etapa (con formato descargable).
  DOCUMENT_REQUIREMENTS: {
    LIST: '/document-requirements',
    DETAIL: (id) => `/document-requirements/${id}`,
    TEMPLATE: (id) => `/document-requirements/${id}/template`,
  },

  ANNOUNCEMENTS: {
    LIST: '/announcements',
    DETAIL: (id) => `/announcements/${id}`,
  },

  SURVEYS: {
    LIST: '/surveys',
    DETAIL: (id) => `/surveys/${id}`,
  },

  REPORTS: {
    LIST: '/reports',
    DETAIL: (id) => `/reports/${id}`,
    STATUS: (id) => `/reports/${id}/status`,
    ATTACHMENTS: (id) => `/reports/${id}/attachments`,
    ATTACHMENT: (id, attachmentId) => `/reports/${id}/attachments/${attachmentId}`,
    ATTACHMENT_FILE: (id, attachmentId) => `/reports/${id}/attachments/${attachmentId}/file`,
  },
};
