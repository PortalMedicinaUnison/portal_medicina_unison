from .base import BaseRepo
from utils.authentication import hash_password
from models.user import  User, PreRegisteredUser
from schemas.user import UserCreate, PreRegisteredUserCreate


class PreRegisteredUserRepo(BaseRepo):
    
    def create(self, data: PreRegisteredUserCreate) -> PreRegisteredUser:
        user = PreRegisteredUser(
            academic_id = data.academic_id,
            assigned_year = data.assigned_year,
            assigned_period = data.assigned_period
        )
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
        
    def get_by_academic_id(self, academic_id: str) -> PreRegisteredUser:
        return self.session.query(PreRegisteredUser).filter_by(academic_id=academic_id).first()

    def update(self, academic_id: str, data: PreRegisteredUserCreate) -> PreRegisteredUser:
        user = self.get_by_academic_id(academic_id)
        if not user:
            raise Exception("El usuario no existe") # REVISAR (usar HTTPException o Exception)

        user.assigned_year = data.assigned_year
        user.assigned_period = data.assigned_period
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete(self, academic_id: str) -> PreRegisteredUser:
        user = self.get_by_academic_id(academic_id)
        if not user:
            raise Exception("El usuario no existe")

        user.is_active = False
        self.session.commit()
        self.session.refresh(user)
        return user

class UserRepo(BaseRepo):

    def create(self, data: UserCreate) -> User:
        user = User(
            academic_id = int(data.academic_id),
            name = data.name,
            paternal_last_name = data.paternal_last_name,
            maternal_last_name = data.maternal_last_name,
            email = data.email,
            password = hash_password(data.password),
            profile_photo = data.profile_photo,
            is_admin = data.is_admin,
            super_admin = data.super_admin,
            is_active = data.is_active
        )
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def get_by_user_id(self, user_id: int):
        return self.session.query(User).filter_by(user_id=user_id).first()
    
    def get_by_academic_id(self, academic_id: str) -> User:
        return self.session.query(User).filter_by(academic_id=academic_id).first()
    
    def get_all(self):
        return self.session.query(User).all()
    
    def update():
        pass

    def delete():
        pass

    def upload_profile_picture():
        pass

class AdminRepo(UserRepo):
    pass

class StudentRepo(UserRepo):
    pass