from .auth import auth_router
from .user import user_router, pre_registered_router
from .communication import announcement_router, survey_router, report_router
from .internship import internship_router
from .site import site_router

routers = [
    # auth_router,
    # user_router,
    # pre_registered_router,
    # announcement_router, 
    # survey_router, 
    # report_router,
    # internship_router,
    site_router
]

__all__ = ["routers"]