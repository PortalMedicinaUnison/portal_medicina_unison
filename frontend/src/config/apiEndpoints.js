export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY_TOKEN: '/auth/verify-token',
    REFRESH_TOKEN: '/auth/refresh',
  },

  USERS: {
    CREATE: '/users',
    GET_ALL: '/users',
    GET: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    UPLOAD_PROFILE_PICTURE: (id) => `/users/${id}/upload-profile-picture`,
  },

  USER_ENROLLMENTS: {
    CREATE: '/user/enrollments',
    GET_ALL: '/user/enrollments',
    GET: (id) => `/user/enrollments/${id}`,
    UPDATE: (id) => `/user/enrollments/${id}`,
    DELETE: (id) => `/user/enrollments/${id}`,
  },

  INTERNSHIPS: {
    CREATE: '/internships',
    GET_ALL: '/internships',
    GET: (id) => `/internships/${id}`,
    GET_BY_STUDENT: (studentId) => `/internships/by-student/${studentId}`,
    GET_BY_SITE: (siteId) => `/internships/by-site/${siteId}`,
    UPDATE: (id) => `/internships/${id}`,
    DELETE: (id) => `/internships/${id}`,
  },

  INTERNSHIP_APPLICATIONS: {
    CREATE: '/internship/applications',
    GET_ALL: '/internship/applications',
    GET_BY_STUDENT: (studentId) => `/internship/applications/${studentId}`,
    GET_BY_STATUS: (isAccepted) => `/internship/applications/by-status/?is_accepted=${isAccepted}`,
    UPDATE: (id) => `/internship/applications/${id}`,
    DELETE: (id) => `/internship/applications/${id}`,
  },

  INTERNSHIP_DOCUMENTS: {
    CREATE: '/internship/documents',
    GET_ALL: '/internship/documents',
    GET: (id) => `/internship/documents/${id}`,
    GET_BY_INTERNSHIP: (internshipId) => `/internship/documents/${internshipId}`,
    UPDATE: (id) => `/internship/documents/${id}`,
    DELETE: (id) => `/internship/documents/${id}`,
  },

  PROMOTIONS: {
    CREATE: '/promotions',
    GET_ALL: '/promotions',
    GET: (id) => `/promotions/${id}`,
    UPDATE: (id) => `/promotions/${id}`,
    DELETE: (id) => `/promotions/${id}`,
  },

  PSD: {
    CREATE: '/psd',
    GET_ALL: '/psd',
    GET: (id) => `/psd/${id}`,
    GET_BY_PROMOTION: (promotionId) => `/psd/by-promotion/${promotionId}`,
    GET_BY_SITE: (siteId) => `/psd/by-site/${siteId}`,
    UPDATE: (id) => `/psd/${id}`,
    DELETE: (id) => `/psd/${id}`,
  },

  SITES: {
    CREATE: '/sites',
    GET_ALL: '/sites',
    GET: (id) => `/sites/${id}`,
    UPDATE: (id) => `/sites/${id}`,
    DELETE: (id) => `/sites/${id}`,
  },

  INSTITUTIONS: {
    CREATE: '/institutions',
    GET_ALL: '/institutions',
    GET: (id) => `/institutions/${id}`,
    UPDATE: (id) => `/institutions/${id}`,
    DELETE: (id) => `/institutions/${id}`,
  },

  REPORTS: {
    CREATE: '/reports',
    GET: (id) => `/reports/${id}`,
    GET_ALL: '/reports',
    UPDATE: (id) => `/reports/${id}`,
    TOGGLE_STATUS: (id) => `/reports/${id}/toggle-status/`,
    GET_BY_INTERNSHIP: (id) => `/reports/internship/${id}`,
    GET_BY_SITE: (id) => `/reports/site/${id}`,
    UPLOAD_EVIDENCE: (id) => `/reports/${id}/upload-evidence/`,
  },

  ADMIN_REPORTS: {
    GET_ALL: '/admin/reports',
    GET_OPEN: '/admin/reports/open',
    GET_CLOSED: '/admin/reports/closed',
    GET: (id) => `/admin/reports/${id}`,
    UPDATE: (id) => `/admin/reports/${id}`,
    ADD_COMMENT: (id) => `/admin/reports/${id}/admin-comment/`,
  },

  ANNOUNCEMENTS: {
    CREATE: '/announcements',
    GET_ALL: '/announcements',
    GET: (id) => `/announcements/${id}`,
    UPDATE: (id) => `/announcements/${id}`,
    DELETE: (id) => `/announcements/${id}`,
  },

  SURVEYS: {
    CREATE: '/surveys',
    GET_ALL: '/surveys',
    GET: (id) => `/surveys/${id}`,
    UPDATE: (id) => `/surveys/${id}`,
    DELETE: (id) => `/surveys/${id}`,
  },
};