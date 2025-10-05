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
    GET_BY_ACADEMIC_ID: (academicId) => `/users/academicId/${academicId}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    UPLOAD_PROFILE_PICTURE: (id) => `/users/${id}/profile-picture`,
  },

  USER_ENROLLMENTS: {
    CREATE: '/enrollments',
    GET_ALL: '/enrollments',
    GET: (id) => `/enrollments/${id}`,
    UPDATE: (id) => `/enrollments/${id}`,
    DELETE: (id) => `/enrollments/${id}`,
  },

  INSTITUTIONS: {
    CREATE: '/institutions',
    GET_ALL: '/institutions',
    GET: (id) => `/institutions/${id}`,
    UPDATE: (id) => `/institutions/${id}`,
    DELETE: (id) => `/institutions/${id}`,
  },
  
  SITES: {
    CREATE: '/sites',
    GET_ALL: '/sites',
    GET: (id) => `/sites/${id}`,
    UPDATE: (id) => `/sites/${id}`,
    DELETE: (id) => `/sites/${id}`,
  },

  PROMOTIONS: {
    CREATE: '/promotions',
    GET_ALL: '/promotions',
    GET: (id) => `/promotions/${id}`,
    UPDATE: (id) => `/promotions/${id}`,
    DELETE: (id) => `/promotions/${id}`,
  },

  PSD: {
    CREATE: '/promotion-site-details',
    GET_ALL: '/promotion-site-details',
    GET: (id) => `/promotion-site-details/${id}`,
    GET_BY_PROMOTION: (promotionId) => `/promotion-site-details/promotionId/${promotionId}`,
    UPDATE: (id) => `/promotion-site-details/${id}`,
    DELETE: (id) => `/promotion-site-details/${id}`,
  },

  INTERNSHIPS: {
    CREATE: '/internships',
    GET_ALL: '/internships',
    GET: (id) => `/internships/${id}`,
    GET_BY_ACADEMIC: (academicId) => `/internships/academicId/${academicId}`,
    GET_BY_SITE: (siteId) => `/internships/siteId/${siteId}`,
    UPDATE: (id) => `/internships/${id}`,
    DELETE: (id) => `/internships/${id}`,
  },

  INTERNSHIP_APPLICATIONS: {
    CREATE: '/internship-applications',
    GET_ALL: '/internship-applications',
    GET: (id) => `/internship-applications/${id}`,
    GET_BY_ACADEMIC: (academicId) => `/internship-applications/academicId/${academicId}`,
    UPDATE: (id) => `/internship-applications/${id}`,
    DELETE: (id) => `/internship-applications/${id}`,
  },

  INTERNSHIP_DOCUMENTS: {
    CREATE: (internshipId) => `/internships/${internshipId}/documents`,
    GET_ALL: (internshipId) => `/internships/${internshipId}/documents`,
    GET: (internshipId, docId) => `/internships/${internshipId}/documents/${docId}`,
    UPDATE: (internshipId, docId) => `/internship/${internshipId}/documents/${docId}`,
    DELETE: (internshipId, docId) => `/internship/${internshipId}/documents/${docId}`,
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

  REPORTS: {
    CREATE: '/reports',
    GET_ALL: '/reports',
    GET: (id) => `/reports/${id}`,
    GET_BY_ACADEMIC: (academicId) => `/reports/academicId/${academicId}`,
    GET_BY_INTERNSHIP: (internshipId) => `/reports/internshipId/${internshipId}`,
    GET_BY_SITE: (siteId) => `/reports/siteId/${siteId}`,
    UPDATE: (id) => `/reports/${id}`,
    DELETE: (id) => `/reports/${id}`,
    UPLOAD_EVIDENCE: (id) => `/reports/${id}/evidence`,
  },
};