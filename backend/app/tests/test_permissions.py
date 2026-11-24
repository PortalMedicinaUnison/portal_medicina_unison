"""
Revisión automática de permisos sobre TODAS las rutas de la API:
- sin token → 401 (salvo las rutas públicas),
- estudiante en rutas de administración → 403,
- administrador en rutas solo para estudiantes → 403.
Si se agrega una ruta nueva sin dependencia de autenticación, esta prueba falla.
"""
import re

import pytest
from fastapi.routing import APIRoute

from core.dependencies import get_current_user, require_admin, require_student, require_super_admin
from main import app
from tests.conftest import auth

PUBLIC_ROUTES = {
    ("POST", "/auth/login"), ("POST", "/auth/register"), ("GET", "/health"),
    ("GET", "/auth/password-reset/options"), ("POST", "/auth/password-reset/request"),
    ("POST", "/auth/password-reset/verify"), ("POST", "/auth/password-reset/confirm"),
}


def _dependency_calls(dependant):
    calls = set()
    for dep in dependant.dependencies:
        calls.add(dep.call)
        calls |= _dependency_calls(dep)
    return calls


def _iter_api_routes(routes, prefix=""):
    """Recorre también los routers incluidos (FastAPI ya no aplana app.routes)."""
    for route in routes:
        if isinstance(route, APIRoute):
            yield prefix + route.path, route
        elif hasattr(route, "original_router"):
            yield from _iter_api_routes(route.original_router.routes, prefix + route.include_context.prefix)


def _routes():
    for path, route in _iter_api_routes(app.routes):
        for method in route.methods:
            yield method, path, _dependency_calls(route.dependant)


def _url(path: str) -> str:
    return re.sub(r"\{[^}]+\}", "1", path)


ALL_ROUTES = list(_routes())


def test_route_discovery_finds_the_whole_api():
    # Salvaguarda: si cambia la forma en que FastAPI expone las rutas, la revisión no debe pasar en vacío.
    assert len(ALL_ROUTES) >= 50
    assert ("POST", "/internship-applications/{application_id}/accept") in {(m, p) for m, p, _ in ALL_ROUTES}


def test_every_non_public_route_requires_authentication():
    unprotected = [
        (method, path) for method, path, calls in ALL_ROUTES
        if (method, path) not in PUBLIC_ROUTES and get_current_user not in calls
    ]
    assert unprotected == []


@pytest.mark.parametrize("method,path", [(m, p) for m, p, _ in ALL_ROUTES if (m, p) not in PUBLIC_ROUTES])
def test_requests_without_token_get_401(client, method, path):
    response = client.request(method, _url(path))
    assert response.status_code == 401, response.text
    assert isinstance(response.json()["detail"], str)


@pytest.mark.parametrize(
    "method,path",
    [(m, p) for m, p, calls in ALL_ROUTES if require_admin in calls or require_super_admin in calls],
)
def test_students_cannot_use_admin_routes(client, student, method, path):
    response = client.request(method, _url(path), headers=auth(student))
    assert response.status_code == 403, response.text


@pytest.mark.parametrize("method,path", [(m, p) for m, p, calls in ALL_ROUTES if require_student in calls])
def test_admins_cannot_use_student_only_routes(client, admin, method, path):
    response = client.request(method, _url(path), headers=auth(admin))
    assert response.status_code == 403, response.text


def test_admin_cannot_use_super_admin_routes(client, admin, student):
    response = client.patch(f"/users/{student.user_id}/role", json={"is_admin": True}, headers=auth(admin))
    assert response.status_code == 403
