from fastapi import UploadFile
from .base import BaseRepo
from models.user import  User, PreRegisteredUser


class PreRegisteredUserRepo(BaseRepo):
    
    def create(self, data: PreRegisteredUser) -> PreRegisteredUser:
        pass
        
    def get_by_academic_id(self, academic_id: str) -> PreRegisteredUser:
        pass

    def get_all(self):
        pass

    def update(self, academic_id: str, data: PreRegisteredUser) -> PreRegisteredUser:
        pass

    def delete(self, academic_id: str) -> PreRegisteredUser:
        pass

class UserRepo(BaseRepo):

    def create(self, data: User) -> User:
        pass

    def get_by_user_id(self, user_id: int):
        pass
    
    def get_by_academic_id(self, academic_id: str) -> User:
        pass

    def get_by_email(self, email: str) -> User:
        pass
    
    def get_all(self):
        pass
    
    def update(self, user_id: int, data: User) -> User:
        pass

    def delete():
        pass

    def upload_profile_picture(self, user_id: str, image: UploadFile) -> User:
        import os

        file_location = os.path.join("profile_images", f"{user_id}.jpg")

        with open(file_location, "wb") as buffer:
            buffer.write(image.file.read())

        user = self.get_by_user_id(user_id)
        if user:
            user.profile_photo = file_location
            self.session.commit()
            self.session.refresh(user)
        
        return user

class AdminRepo(UserRepo):
    pass

class StudentRepo(UserRepo):
    pass