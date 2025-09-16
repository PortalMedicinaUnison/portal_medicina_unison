export const DEFAULT_PROFILE_IMAGE = '/default_picture.jpg';
export const adminAbs = (sub) => `/admin${sub}`;
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
        USER_LIST: '/users',
        USER_DETAIL: (userId) => `/users/${userId}`,
        USER_DETAIL_ACADEMIC: (academicId) => `/users/academic/${academicId}`,
        UPLOAD_PROFILE_PICTURE: (userId) => `/users/${userId}/upload-profile-picture`,

        USER_ENROLLMENT_LIST: '/user/enrollments',
        USER_ENROLLMENT_CREATE: '/user/enrollments/create',
        USER_ENROLLMENT_DETAIL: (enrollmentId) => `/user/enrollments/${enrollmentId}`,
        USER_ENROLLMENT_EDIT: (enrollmentId) => `/user/enrollments/${enrollmentId}/edit`,
        USER_ENROLLMENT_DELETE: (enrollmentId) => `/user/enrollments/${enrollmentId}/delete`,

        SITE_LIST: '/sites',
        SITE_CREATE: '/sites/create',
        SITE_DETAIL: (siteId) => `/sites/${siteId}`,
        SITE_EDIT: (siteId) => `/sites/${siteId}/edit`,
        SITE_DELETE: (siteId) => `/sites/${siteId}/delete`,

        PROMOTION_LIST: '/promotions',
        PROMOTION_CREATE: '/promotions/create',
        PROMOTION_DETAIL: (promotionId) => `/promotions/${promotionId}`,
        PROMOTION_EDIT: (promotionId) => `/promotions/${promotionId}/edit`,
        PROMOTION_DELETE: (promotionId) => `/promotions/${promotionId}/delete`,

        PSD_LIST: '/psd',
        PSD_CREATE: '/psd/create',
        PSD_DETAIL: (psdId) => `/psd/${psdId}`,
        PSD_EDIT: (psdId) => `/psd/${psdId}/edit`,
        PSD_DELETE: (psdId) => `/psd/${psdId}/delete`,

        REPORT_LIST: '/reports',
        REPORT_CREATE: '/reports/create',
        REPORT_DETAIL: (reportId) => `/reports/${reportId}`,
        REPORT_EDIT: (reportId) => `/reports/${reportId}/edit`,
        REPORT_DELETE: (reportId) => `/reports/${reportId}/delete`,

        ANNOUNCEMENTS_LIST: '/announcements',
        ANNOUNCEMENT_CREATE: '/announcements/create',
        ANNOUNCEMENT_DETAIL: (announcementId) => `/announcements/${announcementId}`,
        ANNOUNCEMENT_EDIT: (announcementId) => `/announcements/${announcementId}/edit`,
        ANNOUNCEMENT_DELETE: (announcementId) => `/announcements/${announcementId}/delete`,

        INSTITUTION_LIST: '/institutions',
        INSTITUTION_CREATE: '/institutions/create',
        INSTITUTION_DETAIL: (institutionId) => `/institutions/${institutionId}`,
        INSTITUTION_EDIT: (institutionId) => `/institutions/${institutionId}/edit`,
        INSTITUTION_DELETE: (institutionId) => `/institutions/${institutionId}/delete`,

        SURVEY_LIST: '/surveys',
        SURVEY_CREATE: '/surveys/create',
        SURVEY_DETAIL: (surveyId) => `/surveys/${surveyId}`,
        SURVEY_EDIT: (surveyId) => `/surveys/${surveyId}/edit`,
        SURVEY_DELETE: (surveyId) => `/surveys/${surveyId}/delete`,

        INTERNSHIP_LIST: '/internships',
        INTERNSHIP_CREATE: '/internships/create',
        INTERNSHIP_DETAIL: (internshipId) => `/internships/${internshipId}`,
        INTERNSHIP_EDIT: (internshipId) => `/internships/${internshipId}/edit`,
        INTERNSHIP_DELETE: (internshipId) => `/internships/${internshipId}/delete`,

        INTERNSHIP_APPLICATION_LIST: '/internship/applications',
        INTERNSHIP_APPLICATION_CREATE: '/internship/applications/create',
        INTERNSHIP_APPLICATION_DETAIL: (applicationId) => `/internship/applications/${applicationId}`,
        INTERNSHIP_APPLICATION_EDIT: (applicationId) => `/internship/applications/${applicationId}/edit`,
        INTERNSHIP_APPLICATION_DELETE: (applicationId) => `/internship/applications/${applicationId}/delete`,

        INTERNSHIP_DOCUMENT_LIST: '/internship/documents',
        INTERNSHIP_DOCUMENT_CREATE: '/internship/documents/create',
        INTERNSHIP_DOCUMENT_DETAIL: (documentId) => `/internship/documents/${documentId}`,
        INTERNSHIP_DOCUMENT_EDIT: (documentId) => `/internship/documents/${documentId}/edit`,
        INTERNSHIP_DOCUMENT_DELETE: (documentId) => `/internship/documents/${documentId}/delete`,
        }
}
