from .auth import auth_router
from .user import user_router, user_enrollment_router
from .site import site_router, institution_router
from .promotion import promotion_router, psd_router
from .internship import internship_router, internship_application_router
from .social_service import social_service_router, social_service_application_router
from .document import document_requirement_router
from .communication import announcement_router, survey_router
from .report import report_router

routers = [
    auth_router,
    user_router,
    user_enrollment_router,
    institution_router,
    site_router,
    promotion_router,
    psd_router,
    internship_application_router,
    internship_router,
    social_service_application_router,
    social_service_router,
    document_requirement_router,
    announcement_router,
    survey_router,
    report_router,
]

__all__ = ["routers"]
