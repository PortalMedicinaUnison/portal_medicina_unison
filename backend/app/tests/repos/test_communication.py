import pytest
from models.communication import Announcement, Survey, Report, AnnouncementTypeEnum, ReportTypeEnum
from repos.communication import AnnouncementRepo, SurveyRepo, ReportRepo
from datetime import datetime

def test_create_announcement(db_session):
    announcement_repo = AnnouncementRepo(db_session)
    announcement = Announcement(announcement_id=1, admin_id=1, title="New Announcement", announcement_type=AnnouncementTypeEnum.GENERAL)
    announcement_repo.create(announcement)
    assert announcement_repo.get_by_id(1) is not None

def test_get_by_type_announcement(db_session):
    announcement_repo = AnnouncementRepo(db_session)
    ann = Announcement(announcement_id=2, admin_id=1, title="Type Test", announcement_type=AnnouncementTypeEnum.INTERNSHIP)
    announcement_repo.create(ann)
    assert len(announcement_repo.get_by_type(2)) >= 1

# SurveyRepo Tests

def test_create_survey(db_session):
    survey_repo = SurveyRepo(db_session)
    survey = Survey(survey_id=1,
                    admin_id=1,
                    title="Survey Test",
                    web_link="https://afosd.com",
                    expiration_date=datetime.strptime("1/2/2025", "%d/%m/%Y").date(),
                    mandatory=True)
    survey_repo.create(survey)
    assert survey_repo.get_by_id(1) is not None

def test_get_by_mandatory_survey(db_session):
    survey_repo = SurveyRepo(db_session)
    survey = Survey(
        survey_id=2,
        admin_id=1,
        title="Mandatory Survey",
        web_link="https://example.com",
        expiration_date=datetime.strptime("01/02/2025", "%d/%m/%Y").date(),
        mandatory=True
    )
    survey_repo.create(survey)
    assert len(survey_repo.get_by_mandatory(True)) >= 1

# ReportRepo Tests

def test_create_report(db_session):
    report_repo = ReportRepo(db_session)
    report = Report(
        report_id=1,
        student_id=1, 
        internship_id=1, 
        date=datetime.today().date(),
        site="Company A",
        report_type=ReportTypeEnum.SEXUAL_HARASSMENT,
        description="Test report description",
        anonymity=True
    )
    report_repo.create(report)
    assert report_repo.get_by_id(1) is not None

def test_get_by_mandatory_report(db_session):
    report_repo = ReportRepo(db_session)
    report = Report(
        report_id=2,
        student_id=2,
        internship_id=2,
        date=datetime.today().date(),
        site="Company B",
        report_type=ReportTypeEnum.ACCIDENT,
        description="Anonymous report test",
        anonymity=True
    )
    report_repo.create(report)
    assert len(report_repo.get_by_mandatory(True)) >= 1
