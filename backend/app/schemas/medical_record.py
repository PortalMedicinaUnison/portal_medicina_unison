from pydantic import BaseModel
from typing import List, Optional
from fastapi import UploadFile



class IdentificationCardSchema(BaseModel):
    academic_id: int
    name: str
    paternal_last_name: str
    maternal_last_name: Optional[str] = None
    age: int
    sex: str
    gender: str
    marital_status: str
    birth_place: str
    residence_place: str
    occupation: str
    phone_number: str
    study_date: str

class HereditaryHistorySchema(BaseModel):
    alcoholism: str
    arthritis: str
    cancer: str
    heart_diseases: str
    depression: str
    diabetes: str
    obesity: str
    blood_pressure: str
    smoking: str
    other: str

class NonpathologicalHistorySchema(BaseModel):
    immunizations: str
    feeding: str
    sports: str
    smoking: str
    alcoholism: str
    drug_addictions: str
    housing_status: Optional[str] = None
    house_conditions: str
    who_live_with_you: str
    how_many_people: str 
    how_many_rooms: str 
    work_and_school: str
    work_and_school_details: Optional[str] = None

class PathologicalHistorySchema(BaseModel):
    eruptive_diseases: Optional[str] = None
    infectious_diseases: Optional[str] = None
    traumas: Optional[str] = None
    blood_transfusion: bool
    blood_transfusion_date: Optional[str] = None
    parasitic_diseases: bool
    venereal_diseases: bool
    venereal_diseases_details: Optional[str] = None
    chronic_diseases: bool
    chronic_diseases_details: Optional[str] = None
    surgeries: bool
    surgeries_details: Optional[str] = None
    nervous_breakdown: bool
    nervous_paralysis: bool
    allergic_history: str
    allergic_history_details: Optional[str] = None
    psychological_treatment: Optional[bool] = None
    psychiatric_treatment: Optional[bool] = None
    psychological_treatment_current: Optional[bool] = None
    psychiatric_treatment_current: Optional[bool] = None
    suicidal_thoughts: Optional[bool] = None
    covid: Optional[bool] = None
    covid_date: Optional[str] = None
    covid_symptoms: Optional[str] = None
    covid_vaccine: Optional[bool] = None

class GynecologicalHistorySchema(BaseModel):
    menarche: Optional[str] = None
    menstrual_duration: Optional[str] = None
    menstrual_rhythm: Optional[str] = None
    dysmenorrhea: Optional[str] = None
    were_pregnant: Optional[str] = None
    contraceptive_methods: Optional[str] = None
    pap_smear_test: Optional[str] = None
    
class SexualHistorySchema(BaseModel):
    active_sex_life: str
    sexual_partners_number: str
    sexual_orientation: str
    sexual_partners: str

class CurrentIllnessSchema(BaseModel):
    have_poor_health: bool
    bloody_diarrhea: bool
    weakness: bool
    pain: bool
    thirsty: bool
    convulsions: bool
    fainting: bool
    stomachache: bool
    headache: bool
    hearing_issues: bool
    genital_issues: bool
    weird_urine: bool
    foot_cracks: bool
    joint_issues: bool
    nail_issues: bool
    chest_pain: bool
    unexplained_discomfort: bool
    unexplained_fever: bool
    weight_loss: bool
    eternal_cough: bool

class OdontologicalHistorySchema(BaseModel):
    dental_pieces_number: str
    dental_cleaning: str
    last_dental_checking: str
    dental_pain: str
    bloody_gums: str
    mouth_pain: str
    object_in_mouth: str
    current_dental_treatment: str

class SomatometrySchema(BaseModel):
    weight: int
    size: int
    bmi: int
    heart_rate: int
    respiratory_rate: int
    blood_pressure: int
    temperature: int

class OptometricExaminationSchema(BaseModel):
    do_you_wear_glasses: str

class SystemsReviewSchema(BaseModel):
    digestive_abdomen_shape: bool
    digestive_hernias: bool
    digestive_diarreas: bool
    digestive_other_illnesses: bool
    respiratory_nose_shape: bool
    respiratory_clean_fields: bool
    respiratory_chest_shape: bool
    respiratory_chronic_cough: bool
    respiratory_asthma: bool
    respiratory_other_illnesses: bool
    cardiovascular_noises: bool
    cardiovascular_murmurs: bool
    cardiovascular_arrhythmias: bool
    cardiovascular_dyspnoea: bool
    cardiovascular_other_illnesses: bool
    urinary_urine_smell: bool
    urinary_urine_appearence: bool
    urinary_pain: bool
    urinary_wishes_to_urinate: bool
    urinary_other_illnesses: bool
    male_genitals_penis_retraction: bool
    male_genitals_scrotum_pain: bool
    male_genitals_testicles_in_scrotum: bool
    female_genitals_have_you_menstruate: bool
    female_genitals_regular_menstruation: bool
    female_genitals_are_genital_and_tits_normal: bool
    nervous_system_nervous_tics: bool
    nervous_system_convulsions: bool
    nervous_system_headache: bool
    nervous_system_sleep_well: bool
    nervous_system_other_illnesses: bool
    skeletal_muscular_normal_posture: bool
    skeletal_muscular_scoliosis: bool
    skeletal_muscular_polio_after_effects: bool
    skeletal_muscular_plane_foot: bool
    skeletal_muscular_other_illnesses: bool
    endocrine_normal_weight: bool
    endocrine_overweight: bool
    endocrine_underweight: bool

class ExternalAppearanceSchema(BaseModel):
    external_appearance: str

class PhysicalExaminationSchema(BaseModel):
    head: str
    neck: str
    chest: str
    abdomen: str
    genitals: str
    limbs: str
    lab_exam: str
    therapeutics_used: str
    diagnosis: str
    treatment: str

class MedicalRecordSchema(BaseModel):
    id: int
    identification_card: IdentificationCardSchema
    hereditary_history: HereditaryHistorySchema
    nonpathological_history: NonpathologicalHistorySchema
    pathological_history: PathologicalHistorySchema
    gynecological_history: Optional[GynecologicalHistorySchema] = None
    sexual_history: SexualHistorySchema
    current_illness: CurrentIllnessSchema
    odontological_history: OdontologicalHistorySchema
    somatometry: SomatometrySchema
    optometric_examination: OptometricExaminationSchema
    systems_review: SystemsReviewSchema
    external_appearance: ExternalAppearanceSchema
    physical_examination: PhysicalExaminationSchema




