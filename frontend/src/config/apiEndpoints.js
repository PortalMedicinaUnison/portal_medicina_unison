export const API_ENDPOINTS = {
    AUTH: {
      LOGIN:         '/auth/login',
      VERIFY_TOKEN:  '/auth/verify-token',
      REFRESH_TOKEN: '/auth/refresh',
    },

    USERS: {
      CREATE:  '/users',
      GET_ALL:    '/users',
      GET:     (id) => `/users/${id}`,
      UPDATE:  (id) => `/users/${id}`,
      DELETE:  (id) => `/users/${id}`,
    },

    PROMOTIONS: {
      CREATE: '/promotions',
      GET_ALL: '/promotions',
      GET: (id) => `/promotions/${id}`,
      UPDATE: (id) => `/promotions/${id}`,
      DELETE: (id) => `/promotions/${id}`,
    },

    PSD: {
      CREATE:  '/psd',
      GET_ALL:    '/psd',
      GET:     (id) => `/psd/${id}`,
      GET_BY_PROMOTION: (promotionId) => `/psd/by-promotion/${promotionId}`,
      GET_BY_SITE:      (siteId) => `/psd/by-site/${siteId}`,
      UPDATE:  (id) => `/psd/${id}`,
      DELETE:  (id) => `/psd/${id}`,
    },

    SITES: {
      CREATE:  '/sites',
      GET_ALL:    '/sites',
      GET:     (id) => `/sites/${id}`,
      UPDATE:  (id) => `/sites/${id}`,
      DELETE:  (id) => `/sites/${id}`,
    },

    INSTITUTIONS: {
      CREATE:  '/institutions',
      GET_ALL:    '/institutions',
      GET:     (id) => `/institutions/${id}`,
      UPDATE:  (id) => `/institutions/${id}`,
      DELETE:  (id) => `/institutions/${id}`,
    },

    REPORTS: {
      CREATE:  '/reports/',
      GET:     (id) => `/reports/${id}/`,
      GET_ALL:    '/reports/',
      UPDATE:  (id) => `/reports/${id}/`,
      TOGGLE_STATUS: (id) => `/reports/${id}/toggle-status/`,
      GET_BY_INTERNSHIP: (id) => `/reports/internship/${id}/`,
      GET_BY_SITE: (id) => `/reports/site/${id}/`,
      UPLOAD_EVIDENCE: (id) => `/reports/${id}/upload-evidence/`,
    },

    ADMIN_REPORTS: {
      GET_ALL:    '/admin/reports/',
      GET_OPEN:   '/admin/reports/open/',
      GET_CLOSED: '/admin/reports/closed/',
      GET:        (id) => `/admin/reports/${id}/`,
      UPDATE:     (id) => `/admin/reports/${id}/`,
      ADD_COMMENT: (id) => `/admin/reports/${id}/admin-comment/`,
    },
  
    ANNOUNCEMENTS: {
        CREATE: '/announcements',
        GET_ALL: '/announcements',
        GET: (id) => `/announcements/${id}`,
        UPDATE: (id) => `/announcements/${id}`,
        DELETE: (id) => `/announcements/${id}`
    },

    SURVEYS: {
        CREATE: '/surveys',
        GET: (id) => `/surveys/${id}`,
        GET_ALL: '/surveys',
        UPDATE: (id) => `/surveys/${id}`,
        DELETE: (id) => `/surveys/${id}`
    },

    ENROLLMENTS: {
      CREATE:        '/internship_enrollments',
      GET_ALL:       '/internship_enrollments',
      GET:           (id) => `/internship_enrollments/${id}`,
      GET_BY_STUDENT:(studentId) => `/internship_enrollments/by-student/${studentId}`,
      GET_BY_STATUS: (isAccepted) => `/internship_enrollments?is_accepted=${isAccepted}`,
      UPDATE:        (id) => `/internship_enrollments/${id}`,
      DELETE:        (id) => `/internship_enrollments/${id}`,
    },
    
    INTERNSHIPS: {
      CREATE:        '/internships',
      GET_ALL:       '/internships',
      GET:           (id) => `/internships/${id}`,
      GET_BY_STUDENT:(studentId) => `/internships/by-student/${studentId}`,
      GET_BY_SITE:   (siteId) => `/internships/by-site/${siteId}`,
      UPDATE:        (id) => `/internships/${id}`,
      DELETE:        (id) => `/internships/${id}`,
    },
  
    INTERNSHIPS_DOCUMENTS: {
      CREATE:           '/internship_documents',
      GET:              (id) => `/internship_documents/${id}`,
      GET_BY_INTERNSHIP:(internshipId) => `/internship_documents/by-internship/${internshipId}`,
      UPDATE:           (id) => `/internship_documents/${id}`,
      DELETE:           (id) => `/internship_documents/${id}`,
    }

};
  
