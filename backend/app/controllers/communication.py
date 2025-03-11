from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repos.communication import AnnouncementRepo, SurveyRepo, ReportRepo
from models.communication import Announcement, Survey, Report, AnnouncementTypeEnum
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
    return created_announcement.__dict__

def read_announcements_by_type(announcement_type: AnnouncementTypeEnum, db: Session):
    announcement_repo = AnnouncementRepo(db)
    read_announcements = announcement_repo.get_by_type(announcement_type)
    return [model.__dict__ for model in read_announcements]

def read_single_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    read_announcement = announcement_repo.get_by_id(announcement_id)
    if read_announcement is None:
        return None
    return read_announcement.__dict__

def update_announcement(announcement_id: int, announcement: AnnouncementInput, db: Session):
    pass
    # announcement_repo = AnnouncementRepo(db)
    # updated_announcement = announcement_repo.update(announcement_id, announcement)
    # return updated_announcement.__dict__

def delete_announcement(announcement_id: int, db: Session):
    announcement_repo = AnnouncementRepo(db)
    deleted_announcement = announcement_repo.delete(announcement_id)
    return deleted_announcement

# ---------------  Survey  ----------------------

def create_survey(survey: SurveyInput, db: Session):
    survey_repo = SurveyRepo(db)
    new_survey = Survey(
        admin_id = survey.admin_id,
        title = survey.title,
        web_link = str(survey.web_link),
        description = survey.description,
        expiration_date = survey.expiration_date,
        mandatory = survey.mandatory
    )
    created_survey = survey_repo.create(new_survey)
    return created_survey.__dict__

def read_surveys_by_mandatory(mandatory: bool, db: Session):
    survey_repo = SurveyRepo(db)
    read_surveys = survey_repo.get_by_mandatory(mandatory)
    return [model.__dict__ for model in read_surveys]

def read_single_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    read_survey = survey_repo.get_by_id(survey_id)
    if read_survey is None:
        return None
    return read_survey.__dict__

def update_survey(survey_id: int, survey: SurveyInput, db: Session):
    pass
    # survey_repo = SurveyRepo(db)
    # updated_survey = survey_repo.update(survey_id, survey)
    # return updated_survey.__dict__

def delete_survey(survey_id: int, db: Session):
    survey_repo = SurveyRepo(db)
    deleted_survey = survey_repo.delete(survey_id)
    return deleted_survey


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
    return created_report.__dict__

def read_reports_by_mandatory(mandatory: bool, db: Session):
    report_repo = ReportRepo(db)
    read_reports = report_repo.get_by_mandatory(mandatory)
    return [model.__dict__ for model in read_reports]

def read_single_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    read_report = report_repo.get_by_id(report_id)
    if read_report is None:
        return None
    return read_report.__dict__

def update_report(report_id: int, report: ReportInput, db: Session):
    pass
    # report_repo = ReportRepo(db)
    # updated_report = report_repo.update(report_id, report)
    # return updated_report.__dict__

def delete_report(report_id: int, db: Session):
    report_repo = ReportRepo(db)
    deleted_report = report_repo.delete(report_id)
    return deleted_report