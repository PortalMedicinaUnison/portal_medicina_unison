from .auth import auth_router
from .user import user_router, pre_registered_router

routers = [
    auth_router,
    user_router,
    pre_registered_router
]

__all__ = ["routers"]