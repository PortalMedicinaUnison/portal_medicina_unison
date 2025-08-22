from .user import PreRegisteredUserInput, UserInput
from .site import SiteInput
from .internship import InternshipEnrollmentInput, InternshipInput, InternshipDocumentInput
from .communication import AnnouncementInput, SurveyInput, ReportInput
from .promotion import PromotionInput, PromotionInputUpdate, PromotionSiteDetailInput, PromotionSiteDetailInputUpdate


__all__ = [
    "UserInput",
    "PreRegisteredUserInput",
    "SiteInput",
    "PromotionInput",
    "PromotionInputUpdate",
    "PromotionSiteDetailInput",
    "PromotionSiteDetailInputUpdate",
    "InternshipEnrollmentInput",
    "InternshipInput",
    "InternshipDocumentInput",
    "AnnouncementInput",
    "SurveyInput",
    "ReportInput",
]