export const DEFAULT_PROFILE_IMAGE = '/default_picture.jpg';
export const adminAbs = (sub) => `/admin/${sub}`;

export const ROUTES = {
    HOME: '/',
    
    AUTH: {
        LOGIN: '/login',
        SIGNUP: '/signup',
    },

    USER: {
        PROFILE: '/profile',
        EDIT_PROFILE: '/profile/edit',
        REMOVE_USER: '/delete-account',
        CHANGE_PASSWORD: '/reset-password',
    },

    ADMIN: {
        SITE_LIST: 'sites',
        SITE_CREATE: 'sites/create',
        SITE_INFO: (siteId) => `sites/${siteId}`,

        USER_LIST: 'users',
        USER_DETAIL: (userId) => `users/${userId}`,

        REPORT_LIST: 'reports',
        REPORT_DETAIL: (reportId) => `reports/${reportId}`,

        ANNOUNCEMENT_LIST: 'announcements',
        ANNOUNCEMENT_DETAIL: (announcementId) => `announcements/${announcementId}`,
        ANNOUNCEMENT_CREATE: 'announcements/create',
        ANNOUNCEMENT_DELETE: (announcementId) => `announcements/${announcementId}/delete`,

        INSTITUTION_LIST: 'institutions',
        INSTITUTION_DETAIL: (institutionId) => `institutions/${institutionId}`,
        INSTITUTION_CREATE: 'institutions/create',
        INSTITUTION_EDIT: (institutionId) => `institutions/${institutionId}/edit`,
        INSTITUTION_DELETE: (institutionId) => `institutions/${institutionId}/delete`,
    }
}
