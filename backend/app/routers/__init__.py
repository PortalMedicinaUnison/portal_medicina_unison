from .auth import router as auth_router

routers = [
    auth_router
]

__all__ = ["routers"]