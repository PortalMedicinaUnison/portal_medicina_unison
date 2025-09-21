from .user import (
    UserEnrollmentInput, UserEnrollmentInputUpdate,UserEnrollmentOutput,
    UserInput, UserInputUpdate, UserOutput
)
from .site import (
    SiteInput, SiteInputUpdate, SiteOutput, SiteBasicOutput,
    InstitutionInput, InstitutionOutput
)
from .promotion import (
    PromotionInput, PromotionInputUpdate, PromotionOutput,
    PromotionSiteDetailInput, PromotionSiteDetailInputUpdate, PromotionSiteDetailOutput
)
from .internship import (
    InternshipApplicationInput, InternshipApplicationUpdate, InternshipApplicationOutput,
    InternshipInput, InternshipUpdate, InternshipOutput,
    InternshipDocumentInput, InternshipDocumentUpdate, InternshipDocumentOutput
)
from .communication import (
    AnnouncementInput, AnnouncementOutput,
    SurveyInput, SurveyOutput,
)
from .report import ReportInput, ReportInputUpdate, ReportOutput


__all__ = [
    # User
    "UserEnrollmentInput",
    "UserEnrollmentInputUpdate",
    "UserEnrollmentOutput",
    "UserInput",
    "UserInputUpdate",
    "UserOutput",

    # Site
    "SiteInput",
    "SiteInputUpdate",
    "SiteOutput",
    "SiteBasicOutput",
    "InstitutionInput",
    "InstitutionOutput",

    # Promotion
    "PromotionInput",
    "PromotionInputUpdate",
    "PromotionOutput",
    "PromotionSiteDetailInput",
    "PromotionSiteDetailInputUpdate",
    "PromotionSiteDetailOutput",

    # Internship
    "InternshipApplicationInput",
    "InternshipApplicationUpdate",
    "InternshipApplicationOutput",
    "InternshipInput",
    "InternshipUpdate",
    "InternshipOutput",
    "InternshipDocumentInput",
    "InternshipDocumentUpdate",
    "InternshipDocumentOutput",

    # Communication
    "AnnouncementInput",
    "AnnouncementOutput",
    "SurveyInput",
    "SurveyOutput",

    # Report
    "ReportInput",
    "ReportInputUpdate",
    "ReportOutput",
]
