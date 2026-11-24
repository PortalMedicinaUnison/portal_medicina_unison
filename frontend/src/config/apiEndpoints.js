// Endpoints del backend. Las rutas identifican recursos ("/sites/3");
// los filtros se envían como query params desde los servicios (p. ej. { params: { site_id: 3 } }).
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },

  USERS: {
    LIST: '/users',
    ME: '/users/me',
    ME_PASSWORD: '/users/me/password',
    ME_PHOTO: '/users/me/photo',
    DETAIL: (id) => `/users/${id}`,
    ROLE: (id) => `/users/${id}/role`,
    REACTIVATE: (id) => `/users/${id}/reactivate`,
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
  },

  INTERNSHIPS: {
    LIST: '/internships',
    DETAIL: (id) => `/internships/${id}`,
  },

  INTERNSHIP_DOCUMENTS: {
    LIST: (internshipId) => `/internships/${internshipId}/documents`,
    DETAIL: (internshipId, docId) => `/internships/${internshipId}/documents/${docId}`,
    FILE: (internshipId, docId) => `/internships/${internshipId}/documents/${docId}/file`,
  },

  SOCIAL_SERVICE_APPLICATIONS: {
    LIST: '/social-service-applications',
    DETAIL: (id) => `/social-service-applications/${id}`,
    ACCEPT: (id) => `/social-service-applications/${id}/accept`,
    DECLINE: (id) => `/social-service-applications/${id}/decline`,
  },

  SOCIAL_SERVICES: {
    LIST: '/social-services',
    DETAIL: (id) => `/social-services/${id}`,
  },

  SOCIAL_SERVICE_DOCUMENTS: {
    LIST: (socialServiceId) => `/social-services/${socialServiceId}/documents`,
    DETAIL: (socialServiceId, docId) => `/social-services/${socialServiceId}/documents/${docId}`,
    FILE: (socialServiceId, docId) => `/social-services/${socialServiceId}/documents/${docId}/file`,
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
  },
};
