from .base import Base
from .user import UserEnrollment, User
from .site import Institution, Site
from .promotion import Promotion, PromotionSiteDetail, ProgramEnum
from .internship import InternshipApplication, Internship, ApplicationStatusEnum, InternshipStatusEnum
from .social_service import SocialServiceApplication, SocialService, SocialServiceStatusEnum
from .document import DocumentRequirement, ApplicationDocument, DocumentStageEnum, ReviewStatusEnum
from .communication import Announcement, Survey, AnnouncementTypeEnum
from .report import Report, ReportTypeEnum
from .password_reset import PasswordResetToken

# La historia clínica (models/medical_record.py) queda fuera por ahora:
# es opcional y se retomará al final del proyecto.

__all__ = [
    "Base",
    "UserEnrollment", "User",
    "Institution", "Site",
    "Promotion", "PromotionSiteDetail", "ProgramEnum",
    "InternshipApplication", "Internship", "ApplicationStatusEnum", "InternshipStatusEnum",
    "SocialServiceApplication", "SocialService", "SocialServiceStatusEnum",
    "DocumentRequirement", "ApplicationDocument", "DocumentStageEnum", "ReviewStatusEnum",
    "Announcement", "Survey", "AnnouncementTypeEnum",
    "Report", "ReportTypeEnum",
    "PasswordResetToken",
]
