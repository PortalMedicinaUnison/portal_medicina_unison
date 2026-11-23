from typing import Annotated, Optional

from pydantic import AfterValidator, BaseModel

from schemas.common import OptionalEmail, OptionalStr, ORMModel, RequiredStr
from utils.constants import MUNICIPALITY_SET


def _validate_city(city: str) -> str:
    city = city.strip()
    if city not in MUNICIPALITY_SET:
        raise ValueError("El municipio no es válido.")
    return city


City = Annotated[str, AfterValidator(_validate_city)]


# ---------------------- INSTITUTION ----------------------

class InstitutionInput(BaseModel):
    name: RequiredStr(100)


class InstitutionUpdate(BaseModel):
    name: RequiredStr(100) = None


class InstitutionBasic(ORMModel):
    institution_id: int
    name: str


class InstitutionOutput(ORMModel):
    institution_id: int
    name: str


# ---------------------- SITE ----------------------

class SiteInput(BaseModel):
    name: RequiredStr(200)
    institution_id: int
    address: RequiredStr(255)
    city: City
    teaching_head_name: RequiredStr(100)
    teaching_head_email: OptionalEmail = None
    teaching_head_phone: OptionalStr(15) = None
    teaching_deputy_name: OptionalStr(100) = None
    teaching_deputy_email: OptionalEmail = None
    teaching_deputy_phone: OptionalStr(15) = None


class SiteUpdate(BaseModel):
    name: RequiredStr(200) = None
    institution_id: int = None
    address: RequiredStr(255) = None
    city: City = None
    teaching_head_name: RequiredStr(100) = None
    teaching_head_email: OptionalEmail = None
    teaching_head_phone: OptionalStr(15) = None
    teaching_deputy_name: OptionalStr(100) = None
    teaching_deputy_email: OptionalEmail = None
    teaching_deputy_phone: OptionalStr(15) = None


class SiteBasicOutput(ORMModel):
    site_id: int
    name: str
    city: str


class SiteOutput(ORMModel):
    site_id: int
    institution_id: int
    name: str
    address: str
    city: str
    teaching_head_name: str
    teaching_head_email: Optional[str] = None
    teaching_head_phone: Optional[str] = None
    teaching_deputy_name: Optional[str] = None
    teaching_deputy_email: Optional[str] = None
    teaching_deputy_phone: Optional[str] = None
    institution: Optional[InstitutionBasic] = None
