from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from schemas.communication import AnnouncementInput, SurveyInput, ReportInput

# ---------------  Announcement  ----------------------

def create_announcement(announcement: AnnouncementInput, db: Session):
    pass

def read_all_announcements(skip: int, limit: int, db: Session):
    pass

def read_single_announcement(announcement_id: int, db: Session):
    pass

def update_announcement(announcement_id: int, announcement: AnnouncementInput, db: Session):
    pass

def delete_announcement(announcement_id: int, db: Session):
    pass

# ---------------  Survey  ----------------------

def create_survey(survey: SurveyInput, db: Session):
    pass

def read_all_surveys(skip: int, limit: int, db: Session):
    pass

def read_single_survey(survey_id: int, db: Session):
    pass

def update_survey(survey_id: int, survey: SurveyInput, db: Session):
    pass

def delete_survey(survey_id: int, db: Session):
    pass


# ---------------  Report  ----------------------

def create_report(report: ReportInput, db: Session):
    pass

def read_all_reports(skip: int, limit: int, db: Session):
    pass

def read_single_report(report_id: int, db: Session):
    pass

def update_report(report_id: int, report: ReportInput, db: Session):
    pass

def delete_report(report_id: int, db: Session):
    pass