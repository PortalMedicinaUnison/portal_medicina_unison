from .auth import auth_router
from .user import user_router, user_enrollment_router
from .site import site_router, institution_router
from .promotion import promotion_router, psd_router
from .internship import internship_router, internship_application_router, internship_document_router
from .communication import announcement_router, survey_router
from .report import report_router

routers = [
    #  Authentication
    auth_router,

    # User
    user_router,
    user_enrollment_router,

    # Site
    site_router,
    institution_router,
    
    # Promotion
    promotion_router,
    psd_router,
    
    # Internship
    internship_router,
    internship_application_router,
    internship_document_router,
    
    # Communication
    announcement_router,
    survey_router,

    # Report
    report_router,
]

__all__ = ["routers"]