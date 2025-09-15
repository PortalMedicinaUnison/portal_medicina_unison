export const DEFAULT_PROFILE_IMAGE = '/default_picture.jpg';
export const adminAbs = (sub) => `/admin/${sub}`;
export const userAbs = (sub) => {
  // Remove leading slash if present to avoid double slashes
  const cleanSub = sub.startsWith('/') ? sub.slice(1) : sub;
  return `/${cleanSub}`;
};

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
        
        // Reports routes
        REPORTS_LIST: '/reports',
        REPORT_CREATE: '/reports/create',
        REPORT_INFO: (reportId) => `/reports/${reportId}`,
        REPORT_EDIT: (reportId) => `/reports/${reportId}/edit`,
    },

    ADMIN: {
        SITE_LIST: 'sites',
        SITE_CREATE: 'sites/create',
        SITE_INFO: (siteId) => `sites/${siteId}`,

        USER_LIST: 'users',
        USER_DETAIL: (userId) => `users/${userId}`,

        PROMOTION_LIST: 'promotions',
        PROMOTION_DETAIL: (promotionId) => `promotions/${promotionId}`,
        PROMOTION_CREATE: 'promotions/create',

        REPORT_LIST: 'reports',
        REPORT_DETAIL: (reportId) => `reports/${reportId}`,

        ANNOUNCEMENTS_LIST: 'announcements',
        ANNOUNCEMENT_DETAIL: (announcementId) => `announcements/${announcementId}`,
        ANNOUNCEMENT_CREATE: 'announcements/create',
        ANNOUNCEMENT_DELETE: (announcementId) => `announcements/${announcementId}/delete`,

        INSTITUTION_LIST: 'institutions',
        INSTITUTION_DETAIL: (institutionId) => `institutions/${institutionId}`,
        INSTITUTION_CREATE: 'institutions/create',
        INSTITUTION_EDIT: (institutionId) => `institutions/${institutionId}/edit`,
        INSTITUTION_DELETE: (institutionId) => `institutions/${institutionId}/delete`,

        SURVEY_LIST: 'surveys',
        SURVEY_DETAIL: (surveyId) => `surveys/${surveyId}`,
        SURVEY_CREATE: 'surveys/create',
        SURVEY_EDIT: (surveyId) => `surveys/${surveyId}/edit`,
        SURVEY_DELETE: (surveyId) => `surveys/${surveyId}/delete`,
    }
}
