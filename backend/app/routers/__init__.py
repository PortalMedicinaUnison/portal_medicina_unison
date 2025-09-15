from .auth import auth_router
from .user import user_router, pre_registered_router
from .communication import announcement_router, survey_router, report_router, admin_report_router
from .internship import internship_router, internship_enrollment_router
from .site import site_router, institution_router
from .promotion import promotion_router, psd_router

routers = [
    auth_router,
    user_router,
    pre_registered_router,
    announcement_router, 
    survey_router, 
    report_router,
    admin_report_router,
    internship_router,
    internship_enrollment_router,
    site_router,
    institution_router,
    promotion_router,
    psd_router
]

__all__ = ["routers"]