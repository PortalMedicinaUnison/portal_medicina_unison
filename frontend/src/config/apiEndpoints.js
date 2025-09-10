export const API_ENDPOINTS = {
    AUTH: {
      LOGIN:         '/auth/login/',
      VERIFY_TOKEN:  '/auth/verify-token/',
      REFRESH_TOKEN: '/auth/refresh/',
    },

    USERS: {
      CREATE:  '/users/',
      GET:     (id) => `/users/${id}/`,
      GET_ALL:    '/users/',
      UPDATE:  (id) => `/users/${id}/`,
      DELETE:  (id) => `/users/${id}/`,
    },

    PROMOTIONS: {
      CREATE: '/promotions/',
      GET: (id) => '/promotions/${id}/',
      GET_ALL: '/promotions/',
      UPDATE: (id) => `/promotions/${id}/`,
      DELETE: (id) => `/promotions/${id}/`,
    },

    PSD: {
      CREATE:  '/psd/',
      GET:     (id) => `/psd/${id}/`,
      GET_ALL:    '/psd/',
      UPDATE:  (id) => `/psd/${id}/`,
      DELETE:  (id) => `/psd/${id}/`,
    },

    SITES: {
      CREATE:  '/sites/',
      GET:     (id) => `/sites/${id}/`,
      GET_ALL:    '/sites/',
      UPDATE:  (id) => `/sites/${id}/`,
      DELETE:  (id) => `/sites/${id}/`,
    },

    INSTITUTIONS: {
      CREATE:  '/institutions/',
      GET:     (id) => `/institutions/${id}/`,
      GET_ALL:    '/institutions/',
      UPDATE:  (id) => `/institutions/${id}/`,
      DELETE:  (id) => `/institutions/${id}/`,
    },

    ANNOUNCEMENTS: {
        CREATE: '/announcements/',
        GET: (id) => `/announcements/${id}`,
        GET_ALL: '/announcements/',
        UPDATE: (id) => `/announcements/${id}`,
        DELETE: (id) => `/announcements/${id}`
    }
};
  
