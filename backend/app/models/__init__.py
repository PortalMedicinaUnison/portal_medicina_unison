from .base import Base
from .user import UserEnrollment, User
from .site import Institution, Site
from .promotion import Promotion, PromotionSiteDetail
from .internship import (
    InternshipApplication, Internship, InternshipDocument,
    ApplicationStatusEnum, InternshipStatusEnum, DocumentTypeEnum,
)
from .communication import Announcement, Survey, AnnouncementTypeEnum
from .report import Report, ReportTypeEnum

# La historia clínica (models/medical_record.py) queda fuera por ahora:
# es opcional y se retomará al final del proyecto.

__all__ = [
    "Base",
    "UserEnrollment", "User",
    "Institution", "Site",
    "Promotion", "PromotionSiteDetail",
    "InternshipApplication", "Internship", "InternshipDocument",
    "ApplicationStatusEnum", "InternshipStatusEnum", "DocumentTypeEnum",
    "Announcement", "Survey", "AnnouncementTypeEnum",
    "Report", "ReportTypeEnum",
]
