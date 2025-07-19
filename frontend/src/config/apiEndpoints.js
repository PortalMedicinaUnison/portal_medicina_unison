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
};
  