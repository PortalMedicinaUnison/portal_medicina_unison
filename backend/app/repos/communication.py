from .base import BaseRepo
from models.communication import Announcement, Survey, Report, AnnouncementTypeEnum, ReportTypeEnum


# ----------------------  ANNOUNCEMENT  ----------------------

class AnnouncementRepo(BaseRepo):
    def create(self, data: Announcement) -> Announcement:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data

    def get_all(self) -> list[Announcement]:
        return self.session.query(Announcement).filter(
            Announcement.is_active == True
        ).all()

    def get_by_id(self, announcement_id: int) -> Announcement:
        return self.session.query(Announcement).filter(
            Announcement.announcement_id == announcement_id,
            Announcement.is_active == True,
        ).first()

    def update(self, announcement_id: int, data: dict) -> Announcement:
        announcement = self.get_by_id(announcement_id)
        if announcement:
            data = data.dict(exclude_unset=True)
            for key, value in data.items():
                if hasattr(announcement, key):
                    setattr(announcement, key, value)
            self.session.commit()
            self.session.refresh(announcement)
        return announcement
    
    def delete(self, announcement_id: int) -> bool:
        announcement = self.get_by_id(announcement_id)
        if announcement:
            announcement.is_active = False
            self.session.commit()
            return True
        return False

# ----------------------  SURVEY  ----------------------

class SurveyRepo(BaseRepo):
    def create(self, data: Survey) -> Survey:
        self.session.add(data)
        self.session.commit()
        self.session.refresh(data)
        return data
    
    def get_all(self) -> list[Survey]:
        return self.session.query(Survey).filter(
            Survey.is_active == True
        ).all()

    def get_by_id(self, survey_id: int) -> Survey:
        return self.session.query(Survey).filter(
            Survey.survey_id == survey_id,
            Survey.is_active == True,
        ).first()
    
    def update(self, survey_id: int, data: dict) -> Survey:
        survey = self.get_by_id(survey_id)
        if survey:
            for key, value in data.items():
                if hasattr(survey, key):
                    setattr(survey, key, value)
            self.session.commit()
            self.session.refresh(survey)
        return survey
    
    def delete(self, survey_id: int) -> bool:
        survey = self.get_by_id(survey_id)
        if survey:
            self.session.delete(survey)
            self.session.commit()
            return True
        return False