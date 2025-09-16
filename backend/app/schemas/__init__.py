from .user import (
    UserEnrollmentInput, UserEnrollmentInputUpdate,UserEnrollmentOutput,
    UserInput, UserInputUpdate, UserOutput
)
from .site import (
    SiteInput, SiteInputUpdate, SiteOutput, SiteBasicOutput,
    InstitutionInput, InstitutionOutput
)
from .internship import (
    InternshipApplicationInput, InternshipApplicationUpdate, InternshipApplicationOutput,
    InternshipInput, InternshipUpdate, InternshipOutput,
    InternshipDocumentInput, InternshipDocumentUpdate, InternshipDocumentOutput
)
from .communication import (
    AnnouncementInput, AnnouncementOutput,
    SurveyInput, SurveyOutput,
    ReportInput, ReportInputUpdate, ReportOutput, ReportCreateResponse, ReportStatusUpdate, ReportAdminComment
)
from .promotion import (
    PromotionInput, PromotionInputUpdate, PromotionOutput,
    PromotionSiteDetailInput, PromotionSiteDetailInputUpdate, PromotionSiteDetailOutput
)


__all__ = [
    # User
    "UserInput",
    "UserInputUpdate",
    "UserOutput",
    "UserEnrollmentInput",
    "UserEnrollmentInputUpdate",
    UserEnrollmentOutput,

    # Site
    "SiteInput",
    "SiteInputUpdate",
    "SiteOutput",
    "SiteBasicOutput",
    "InstitutionInput",
    "InstitutionOutput",

    # Internship
    "InternshipInput",
    "InternshipUpdate",
    "InternshipOutput",
    "InternshipApplicationInput",
    "InternshipApplicationUpdate",
    "InternshipApplicationOutput",
    "InternshipDocumentInput",
    "InternshipDocumentUpdate",
    "InternshipDocumentOutput",

    # Communication
    "AnnouncementInput",
    "AnnouncementOutput",
    "SurveyInput",
    "SurveyOutput",
    "ReportInput",
    "ReportInputUpdate",
    "ReportOutput",
    "ReportCreateResponse",
    "ReportStatusUpdate",
    "ReportAdminComment",

    # Promotion
    "PromotionInput",
    "PromotionInputUpdate",
    "PromotionOutput",
    "PromotionSiteDetailInput",
    "PromotionSiteDetailInputUpdate",
    "PromotionSiteDetailOutput",
]
