from typing import List, Optional

from sqlalchemy import or_

from models.user import User, UserEnrollment
from .base import BaseRepo


# ----------------------  USER ENROLLMENT  ----------------------

class UserEnrollmentRepo(BaseRepo[UserEnrollment]):
    model = UserEnrollment

    def list(self, academic_id: Optional[str] = None, is_enrolled: Optional[bool] = None) -> List[UserEnrollment]:
        query = self.query()
        if academic_id:
            query = query.filter(UserEnrollment.academic_id.contains(academic_id))
        if is_enrolled is not None:
            query = query.filter(UserEnrollment.is_enrolled.is_(is_enrolled))
        return query.order_by(UserEnrollment.academic_id).all()

    def get_by_academic_id(self, academic_id: str, include_inactive: bool = False) -> Optional[UserEnrollment]:
        query = self.session.query(UserEnrollment) if include_inactive else self.query()
        return query.filter(UserEnrollment.academic_id == academic_id).first()


# ----------------------  USER  ----------------------

class UserRepo(BaseRepo[User]):
    model = User

    def list(
        self, is_admin: Optional[bool] = None, academic_id: Optional[str] = None,
        search: Optional[str] = None, include_inactive: bool = False,
    ) -> List[User]:
        query = self.session.query(User) if include_inactive else self.query()
        if is_admin is True:
            query = query.filter(or_(User.is_admin.is_(True), User.is_super_admin.is_(True)))
        elif is_admin is False:
            query = query.filter(User.is_admin.is_(False), User.is_super_admin.is_(False))
        if academic_id:
            query = query.filter(User.academic_id == academic_id)
        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(or_(
                User.first_name.ilike(pattern), User.last_name.ilike(pattern),
                User.second_last_name.ilike(pattern), User.email.ilike(pattern),
                User.academic_id.ilike(pattern),
            ))
        return query.order_by(User.last_name, User.first_name).all()

    def get_any(self, user_id: int) -> Optional[User]:
        """Incluye cuentas desactivadas (solo para administración)."""
        return self.session.get(User, user_id)

    def get_by_email(self, email: str, include_inactive: bool = False) -> Optional[User]:
        query = self.session.query(User) if include_inactive else self.query()
        return query.filter(User.email == email.strip().lower()).first()

    def get_by_academic_id(self, academic_id: str, include_inactive: bool = False) -> Optional[User]:
        query = self.session.query(User) if include_inactive else self.query()
        return query.filter(User.academic_id == academic_id).first()
