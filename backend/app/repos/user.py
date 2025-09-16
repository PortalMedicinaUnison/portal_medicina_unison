from fastapi import UploadFile
from .base import BaseRepo
from models.user import  User, UserEnrollment


# ----------------------  USER ENROLLMENT  ----------------------

class UserEnrollmentRepo(BaseRepo):
    def create(self, data: UserEnrollment) -> UserEnrollment:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> list[UserEnrollment]:
        return self.session.query(UserEnrollment).filter(
                UserEnrollment.is_active == True).all()

    def get_by_id(self, enrollment_id: int) -> UserEnrollment:
        return self.session.query(UserEnrollment).filter(
                UserEnrollment.enrollment_id == enrollment_id,
                UserEnrollment.is_active == True,
            ).first()

    def get_by_academic_id(self, academic_id: int) -> UserEnrollment:
        return self.session.query(UserEnrollment).filter(
                UserEnrollment.academic_id == academic_id,
                UserEnrollment.is_active == True,
            ).first()

    def update(self, enrollment_id: int, data: dict) -> UserEnrollment:
        user = self.get_by_id(enrollment_id)
        if user:
            for key, value in data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            self.session.commit()
            self.session.refresh(user)
        return user

    def delete(self, enrollment_id: int) -> bool:
        user = self.get_by_id(enrollment_id)
        if user:
            user.is_active = False
            self.session.commit()
            return True
        return False

class UserRepo(BaseRepo):
    def create(self, data: User) -> User:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_all(self) -> list[User]:
        return self.session.query(User).filter(
                User.is_active == True).all()

    def get_by_id(self, user_id: int) -> User:
        return self.session.query(User).filter(
                User.user_id == user_id,
                User.is_active == True,
            ).first()

    def get_by_academic_id(self, academic_id: int) -> User:
        return self.session.query(User).filter(
                User.academic_id == academic_id,
                User.is_active == True,
            ).first()

    def get_by_email(self, email: str) -> User:
        return self.session.query(User).filter(
                User.email == email,
                User.is_active == True,
            ).first()

    def update(self, user_id: int, data: dict) -> User:
        user = self.get_by_id(user_id)
        if user:
            for key, value in data.items():
                if hasattr(user, key): 
                    setattr(user, key, value)
            self.session.commit()
            self.session.refresh(user)
        return user

    def delete(self, user_id: int) -> bool:
        user = self.get_by_id(user_id)
        if user:
            user.is_active = False
            self.session.commit()
            return True
        return False

    def upload_profile_picture(self, user_id: int, image: UploadFile) -> User:
        import os

        file_location = os.path.join("profile_images", f"{user_id}.jpg")

        with open(file_location, "wb") as buffer:
            buffer.write(image.file.read())

        user = self.get_by_id(user_id)
        if user:
            user.profile_photo = file_location
            self.session.commit()
            self.session.refresh(user)
            
        return user

class AdminRepo(UserRepo):
    pass

class StudentRepo(UserRepo):
    pass
