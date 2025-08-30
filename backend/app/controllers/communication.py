from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.communication import AnnouncementRepo, SurveyRepo, ReportRepo
from models.communication import Announcement, Survey, Report, AnnouncementTypeEnum
from schemas.communication import AnnouncementInput, SurveyInput
from schemas.report import ReportInput
from utils.utils import orm_to_dict

# ----------------------  Announcement  ----------------------

def create_announcement(announcement: AnnouncementInput, db: Session):
    new_announcement = Announcement(
        admin_id = announcement.admin_id,
        title = announcement.title,
        announcement_type = announcement.announcement_type,
        description = announcement.description
    )
    announcement_repo = AnnouncementRepo(db)
    created_announcement = announcement_repo.create(new_announcement)
    announcement_response = orm_to_dict(created_announcement)
    return announcement_response

def get_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    announcement = announcement_repo.get_by_id(announcement_id)
    if announcement is None:
        return None
    announcement_response = orm_to_dict(announcement)
    return announcement_response

def get_announcements_by_type(announcement_type: AnnouncementTypeEnum, db: Session):
    announcement_repo = AnnouncementRepo(db)
    announcements = announcement_repo.get_by_type(announcement_type)
    announcements_response = [orm_to_dict(announcement) for announcement in announcements]
    return announcements_response

def update_announcement(announcement_id: int, announcement: AnnouncementInput, db: Session):
    pass
    
def delete_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    return announcement_repo.delete(announcement_id)

# ----------------------  Survey  ----------------------

def create_survey(survey: SurveyInput, db: Session):
    new_survey = Survey(
        admin_id = survey.admin_id,
        title = survey.title,
        web_link = survey.web_link,
        description = survey.description,
        expiration_date = survey.expiration_date,
        mandatory = survey.mandatory
    )
    survey_repo = SurveyRepo(db)
    created_survey = survey_repo.create(new_survey)
    survey_response = orm_to_dict(created_survey)
    return survey_response

def get_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    survey = survey_repo.get_by_id(survey_id)
    if survey is None:
        return None
    survey_response = orm_to_dict(survey)
    return survey_response

def get_surveys_by_mandatory(mandatory: bool, db: Session):
    survey_repo = SurveyRepo(db)
    surveys = survey_repo.get_by_mandatory(mandatory)
    surveys_response = [orm_to_dict(survey) for survey in surveys]
    return surveys_response

def update_survey(survey_id: int, survey: SurveyInput, db: Session):
    pass
    
def delete_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    return survey_repo.delete(survey_id)


# ----------------------  Report  ----------------------

def create_report(report: ReportInput, db: Session):
    new_report = Report(
        student_id = report.student_id,
        internship_id = report.internship_id,
        date = report.date,
        site = report.site,
        report_type = report.report_type,
        other_type = report.other_type,
        description = report.description,
        evidence = report.evidence,
        anonymity = report.anonymity,
        is_open = report.is_open,
        admin_comment = report.admin_comment
    )
    report_repo = ReportRepo(db)
    created_report = report_repo.create(new_report)
    report_response = orm_to_dict(created_report)
    return report_response

def get_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    report = report_repo.get_by_id(report_id)
    if report is None:
        return None
    report_response = orm_to_dict(report)
    return report_response

def get_reports_by_mandatory(mandatory: bool, db: Session):
    report_repo = ReportRepo(db)
    reports = report_repo.get_by_mandatory(mandatory)
    reports_response = [orm_to_dict(report) for report in reports]
    return reports_response

def update_report(report_id: int, report: ReportInput, db: Session):
    pass
    
def delete_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    return report_repo.delete(report_id)