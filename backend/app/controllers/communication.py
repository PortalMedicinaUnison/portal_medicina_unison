from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.communication import AnnouncementRepo, SurveyRepo, ReportRepo
from models.communication import Announcement, Survey, Report
from schemas.communication import AnnouncementInput, SurveyInput, ReportInput

# ---------------  Announcement  ----------------------

def create_announcement(announcement: AnnouncementInput, db: Session):
    announcement_repo = AnnouncementRepo(db)
    new_announcement = Announcement(
        admin_id = announcement.admin_id,
        title = announcement.title,
        announcement_type = announcement.announcement_type,
        description = announcement.description
    )
    created_announcement = announcement_repo.create(new_announcement)
    return created_announcement.dict()

def read_announcements_by_type(db: Session):
    announcement_repo = AnnouncementRepo(db)
    read_announcements = announcement_repo.get_by_type()
    return [model.dict() for model in read_announcements]

def read_single_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    read_announcement = announcement_repo.get_by_id(announcement_id)
    return read_announcement.dict()

def update_announcement(announcement_id: int, announcement: AnnouncementInput, db: Session):
    pass
    # announcement_repo = AnnouncementRepo(db)
    # updated_announcement = announcement_repo.update(announcement_id, announcement)
    # return updated_announcement.dict()

def delete_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    deleted_announcement = announcement_repo.delete(announcement_id)
    return deleted_announcement.dict()

# ---------------  Survey  ----------------------

def create_survey(survey: SurveyInput, db: Session):
    survey_repo = SurveyRepo(db)
    new_survey = Survey(
        admin_id = survey.admin_id,
        title = survey.title,
        web_link = survey.web_link,
        description = survey.description,
        expiration_date = survey.expiration_date,
        mandatory = survey.mandatory
    )
    created_survey = survey_repo.create(new_survey)
    return created_survey.dict()

def read_surveys_by_mandatory(db: Session):
    survey_repo = SurveyRepo(db)
    read_surveys = survey_repo.get_by_mandatory()
    return [model.dict() for model in read_surveys]

def read_single_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    read_survey = survey_repo.get_by_id(survey_id)
    return read_survey.dict()

def update_survey(survey_id: int, survey: SurveyInput, db: Session):
    survey_repo = SurveyRepo(db)
    updated_survey = survey_repo.update(survey_id, survey)
    return updated_survey.dict()

def delete_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    deleted_survey = survey_repo.delete(survey_id)
    return deleted_survey.dict()


# ---------------  Report  ----------------------

def create_report(report: ReportInput, db: Session):
    report_repo = ReportRepo(db)
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
    created_report = report_repo.create(new_report)
    return created_report.dict()

def read_reports_by_mandatory(db: Session):
    report_repo = ReportRepo(db)
    read_reports = report_repo.get_by_mandatory()
    return [model.dict() for model in read_reports]

def read_single_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    read_report = report_repo.get_by_id(report_id)
    return read_report.dict()

def update_report(report_id: int, report: ReportInput, db: Session):
    report_repo = ReportRepo(db)
    updated_report = report_repo.update(report_id, report)
    return updated_report.dict()

def delete_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    deleted_report = report_repo.delete(report_id)
    return deleted_report.dict()