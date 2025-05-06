export const API_ENDPOINTS = {
    AUTH: {
      LOGIN:         '/auth/login/',
      SIGNUP:        '/auth/signup/',
      VERIFY_TOKEN:  '/auth/verify-token/',
      REFRESH_TOKEN: '/auth/refresh/',
    },

    USERS: {
      CREATE:  '/users/',
      GET:     (id) => `/users/${id}/`,
      UPDATE:  (id) => `/users/${id}/`,
      DELETE:  (id) => `/users/${id}/`,
      LIST:    '/users/',
    },
};
  