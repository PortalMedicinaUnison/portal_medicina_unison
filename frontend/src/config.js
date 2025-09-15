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
        USER_LIST: 'users',
        USER_DETAIL: (userId) => `users/${userId}`,

        SITE_LIST: 'sites',
        SITE_CREATE: 'sites/create',
        SITE_DETAIL: (siteId) => `sites/${siteId}`,
        SITE_EDIT: (siteId) => `sites/${siteId}/edit`,
        SITE_DELETE: (siteId) => `sites/${siteId}/delete`,


        PROMOTION_LIST: 'promotions',
        PROMOTION_CREATE: 'promotions/create',
        PROMOTION_DETAIL: (promotionId) => `promotions/${promotionId}`,
        PROMOTION_EDIT: (promotionId) => `promotions/${promotionId}/edit`,
        PROMOTION_DELETE: (promotionId) => `promotions/${promotionId}/delete`,

        PSD_LIST: 'psd',
        PSD_CREATE: 'psd/create',
        PSD_DETAIL: (psdId) => `psd/${psdId}`,
        PSD_EDIT: (psdId) => `psd/${psdId}/edit`,
        PSD_DELETE: (psdId) => `psd/${psdId}/delete`,

        REPORT_LIST: 'reports',
        REPORT_CREATE: 'reports/create',
        REPORT_DETAIL: (reportId) => `reports/${reportId}`,
        REPORT_EDIT: (reportId) => `reports/${reportId}/edit`,
        REPORT_DELETE: (reportId) => `reports/${reportId}/delete`,

        ANNOUNCEMENTS_LIST: 'announcements',
        ANNOUNCEMENT_CREATE: 'announcements/create',
        ANNOUNCEMENT_DETAIL: (announcementId) => `announcements/${announcementId}`,
        ANNOUNCEMENT_EDIT: (announcementId) => `announcements/${announcementId}/edit`,
        ANNOUNCEMENT_DELETE: (announcementId) => `announcements/${announcementId}/delete`,

        INSTITUTION_LIST: 'institutions',
        INSTITUTION_CREATE: 'institutions/create',
        INSTITUTION_DETAIL: (institutionId) => `institutions/${institutionId}`,
        INSTITUTION_EDIT: (institutionId) => `institutions/${institutionId}/edit`,
        INSTITUTION_DELETE: (institutionId) => `institutions/${institutionId}/delete`,

        SURVEY_LIST: 'surveys',
        SURVEY_CREATE: 'surveys/create',
        SURVEY_DETAIL: (surveyId) => `surveys/${surveyId}`,
        SURVEY_EDIT: (surveyId) => `surveys/${surveyId}/edit`,
        SURVEY_DELETE: (surveyId) => `surveys/${surveyId}/delete`,

        INTERNSHIP_LIST: 'internships',
        INTERNSHIP_CREATE: 'internships/create',
        INTERNSHIP_DETAIL: (internshipId) => `internships/${internshipId}`,
        INTERNSHIP_EDIT:   (internshipId) => `internships/${internshipId}/edit`,
        INTERNSHIP_DELETE: (internshipId) => `internships/${internshipId}/delete`,

        ENROLLMENT_LIST:   'internship_enrollments',
        ENROLLMENT_CREATE: 'internship_enrollments/create',
        ENROLLMENT_DETAIL: (enrollmentId) => `internship_enrollments/${enrollmentId}`,
        ENROLLMENT_EDIT:   (enrollmentId) => `internship_enrollments/${enrollmentId}/edit`,
        ENROLLMENT_DELETE: (enrollmentId) => `internship_enrollments/${enrollmentId}/delete`,

        INTERNSHIP_DOCUMENT_LIST:   'internship_documents',
        INTERNSHIP_DOCUMENT_CREATE: 'internship_documents/create',
        INTERNSHIP_DOCUMENT_DETAIL: (documentId) => `internship_documents/${documentId}`,
        INTERNSHIP_DOCUMENT_EDIT:   (documentId) => `internship_documents/${documentId}/edit`,
        INTERNSHIP_DOCUMENT_DELETE: (documentId) => `internship_documents/${documentId}/delete`,
    }
}
