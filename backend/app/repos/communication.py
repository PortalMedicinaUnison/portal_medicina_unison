from .base import BaseRepo
from models.communication import  Announcement, Survey, Report
from schemas.communications import AnnouncementInput, SurveyInput, ReportInput


class AnnouncementRepo(BaseRepo):
    
    def create():
        pass

    def get_by_id():
        pass

    def get_by_type():
        pass

    def update():
        pass

    def delete():
        pass

class SurveyRepo(BaseRepo):
    def create():
        pass

    def get_by_id():
        pass

    def get_by_mandatory():
        pass

    def update():
        pass

    def delete():
        pass

class ReportRepo(BaseRepo):
    def create():
        pass

    def get_by_id():
        pass

    def get_by_mandatory():
        pass

    def update():
        pass

    def delete():
        pass