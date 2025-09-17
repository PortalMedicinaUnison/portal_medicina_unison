from .user import UserEnrollmentRepo, UserRepo
from .site import SiteRepo, InstitutionRepo
from .internship import InternshipRepo, InternshipApplicationRepo, InternshipDocumentRepo
from .communication import AnnouncementRepo, SurveyRepo
from .promotion import PromotionRepo, PromotionSiteDetailRepo
from .report import ReportRepo

__all__ = [
    # User
    "UserEnrollmentRepo",
    "UserRepo",

    # Site
    "SiteRepo",
    "InstitutionRepo",

    # Internship
    "InternshipRepo",
    "InternshipApplicationRepo",
    "InternshipDocumentRepo",

    # Communication
    "AnnouncementRepo",
    "SurveyRepo",

    # Promotion
    "PromotionRepo",
    "PromotionSiteDetailRepo",

    # Report
    "ReportRepo",
]
