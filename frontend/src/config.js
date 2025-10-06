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
        USER_DELETE: (userId) => `/users/${userId}/delete`,
        
        REPORTS_LIST: '/reports',
        REPORT_CREATE: '/reports/create',
        REPORT_DETAIL: (reportId) => `/reports/${reportId}`,
        REPORT_EDIT: (reportId) => `/reports/${reportId}/edit`,

        // INTERNSHIP_APPLICATION_EDIT: (applicationId) => `/applications/${applicationId}/edit`,
        INTERNSHIP_APPLICATION_EDIT: '/my-internship',
    },

    ADMIN: {
        USER_LIST: '/users',
        USER_DETAIL: (userId) => `/users/${userId}`,
        USER_DETAIL_ACADEMIC: (academicId) => `/users/academicId/${academicId}`,
        UPLOAD_PROFILE_PICTURE: (userId) => `/users/${userId}/profile-picture`,

        USER_ENROLLMENT_LIST: '/enrollments',
        USER_ENROLLMENT_CREATE: '/enrollments/create',
        USER_ENROLLMENT_DETAIL: (enrollmentId) => `/enrollments/${enrollmentId}`,
        USER_ENROLLMENT_EDIT: (enrollmentId) => `/enrollments/${enrollmentId}/edit`,
        USER_ENROLLMENT_DELETE: (enrollmentId) => `/enrollments/${enrollmentId}/delete`,

        SITE_LIST: '/sites',
        SITE_CREATE: '/sites/create',
        SITE_DETAIL: (siteId) => `/sites/${siteId}`,
        SITE_EDIT: (siteId) => `/sites/${siteId}/edit`,
        SITE_DELETE: (siteId) => `/sites/${siteId}/delete`,

        INSTITUTION_LIST: '/institutions',
        INSTITUTION_CREATE: '/institutions/create',
        INSTITUTION_DETAIL: (institutionId) => `/institutions/${institutionId}`,
        INSTITUTION_EDIT: (institutionId) => `/institutions/${institutionId}/edit`,
        INSTITUTION_DELETE: (institutionId) => `/institutions/${institutionId}/delete`,

        PROMOTION_LIST: '/promotions',
        PROMOTION_CREATE: '/promotions/create',
        PROMOTION_DETAIL: (promotionId) => `/promotions/${promotionId}`,
        PROMOTION_EDIT: (promotionId) => `/promotions/${promotionId}/edit`,
        PROMOTION_DELETE: (promotionId) => `/promotions/${promotionId}/delete`,

        PSD_LIST: '/promotion-site-details',
        PSD_CREATE: '/promotion-site-details/create',
        PSD_DETAIL: (psdId) => `/promotion-site-details/${psdId}`,
        PSD_EDIT: (psdId) => `/promotion-site-details/${psdId}/edit`,
        PSD_DELETE: (psdId) => `/promotion-site-details/${psdId}/delete`,

        INTERNSHIP_LIST: '/internships',
        INTERNSHIP_CREATE: '/internships/create',
        INTERNSHIP_DETAIL: (internshipId) => `/internships/${internshipId}`,
        INTERNSHIP_EDIT: (internshipId) => `/internships/${internshipId}/edit`,
        INTERNSHIP_DELETE: (internshipId) => `/internships/${internshipId}/delete`,

        INTERNSHIP_APPLICATION_LIST: '/internship-applications',
        INTERNSHIP_APPLICATION_CREATE: '/internship-applications/create',
        INTERNSHIP_APPLICATION_DETAIL: (applicationId) => `/internship-applications/${applicationId}`,
        INTERNSHIP_APPLICATION_EDIT: (applicationId) => `/internship-applications/${applicationId}/edit`,
        INTERNSHIP_APPLICATION_DELETE: (applicationId) => `/internship-applications/${applicationId}/delete`,

        INTERNSHIP_DOCUMENT_LIST: (internshipId) => `/internships/${internshipId}/documents`,
        INTERNSHIP_DOCUMENT_CREATE: (internshipId) => `/internships/${internshipId}/documents/create`,
        INTERNSHIP_DOCUMENT_DETAIL: (internshipId, documentId) => `/internships/${internshipId}/documents/${documentId}`,
        INTERNSHIP_DOCUMENT_EDIT: (internshipId, documentId) => `/internships/${internshipId}/documents/${documentId}/edit`,
        INTERNSHIP_DOCUMENT_DELETE: (internshipId, documentId) => `/internships/${internshipId}/documents/${documentId}/delete`,

        ANNOUNCEMENTS_LIST: '/announcements',
        ANNOUNCEMENT_CREATE: '/announcements/create',
        ANNOUNCEMENT_DETAIL: (announcementId) => `/announcements/${announcementId}`,
        ANNOUNCEMENT_EDIT: (announcementId) => `/announcements/${announcementId}/edit`,
        ANNOUNCEMENT_DELETE: (announcementId) => `/announcements/${announcementId}/delete`,

        SURVEY_LIST: '/surveys',
        SURVEY_CREATE: '/surveys/create',
        SURVEY_DETAIL: (surveyId) => `/surveys/${surveyId}`,
        SURVEY_EDIT: (surveyId) => `/surveys/${surveyId}/edit`,
        SURVEY_DELETE: (surveyId) => `/surveys/${surveyId}/delete`,

        REPORT_LIST: '/reports',
        REPORT_CREATE: '/reports/create',
        REPORT_DETAIL: (reportId) => `/reports/${reportId}`,
        REPORT_EDIT: (reportId) => `/reports/${reportId}/edit`,
        REPORT_DELETE: (reportId) => `/reports/${reportId}/delete`,
    }
}
