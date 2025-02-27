from fastapi import UploadFile
from .base import BaseRepo
from models.user import  User, PreRegisteredUser


class PreRegisteredUserRepo(BaseRepo):

    def create(self, data: PreRegisteredUser) -> PreRegisteredUser:
        """ Crea un nuevo usuario pre-registrado. """
        self.session.add(data)
        self.session.commit()
        return data

    def get_by_academic_id(self, academic_id: int) -> PreRegisteredUser:
        """ Obtiene un usuario pre-registrado por su ID académico. """
        return self.session.query(PreRegisteredUser).filter_by(academic_id=academic_id).first()

    def get_all(self):
        """ Obtiene todos los usuarios pre-registrados. """
        return self.session.query(PreRegisteredUser).all()

    def update(self, academic_id: int, data: dict) -> PreRegisteredUser:
        """ Actualiza la información de un usuario pre-registrado. """
        user = self.get_by_academic_id(academic_id)
        if user:
            for key, value in data.items():
                setattr(user, key, value)
            self.session.commit()
        return user

    def delete(self, user_id: int) -> bool:
        """ Desactiva un usuario por su ID. Retorna True si se desactivó. """
        user = self.get_by_user_id(user_id)
        if user:
            user.is_active = False
            self.session.commit()
            return True
        return False

class UserRepo(BaseRepo):

    def create(self, data: User) -> User:
        """ Crea un nuevo usuario en la base de datos. """
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_by_user_id(self, user_id: int) -> User:
        """ Obtiene un usuario por su ID. """
        return self.session.query(User).filter(User.user_id == user_id).first()

    def get_by_academic_id(self, academic_id: int) -> User:
        """ Obtiene un usuario por su ID académico. """
        return self.session.query(User).filter(User.academic_id == academic_id).first()

    def get_by_email(self, email: str) -> User:
        """ Obtiene un usuario por su correo electrónico. """
        return self.session.query(User).filter(User.email == email).first()

    def get_all(self):
        """ Obtiene todos los usuarios. """
        return self.session.query(User).all()

    def update(self, user_id: int, data: dict) -> User:
        """ Actualiza los datos de un usuario. """
        user = self.get_by_user_id(user_id)
        if user:
            for key, value in data.items():
                if hasattr(user, key): 
                    setattr(user, key, value)
                    self.session.commit()
                    self.session.refresh(user)
        return user

    def delete(self, user_id: int) -> bool:
        """ Desactiva un usuario por su ID. Retorna True si se desactivó. """
        user = self.get_by_user_id(user_id)
        if user:
            user.is_active = False
            self.session.commit()
            return True
        return False


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
