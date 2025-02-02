from pydantic import BaseModel
from typing import List
from fastapi import UploadFile

class StudentRequest(BaseModel):
    student_id: int

class TokenRequest(BaseModel):
    token: str

class AcceptedStudentBase(BaseModel):
    file_number: int

class AcceptedStudentSchema(AcceptedStudentBase):
    id: int

class StudentBase(BaseModel):
    name : str = None
    pat_last_name : str = None
    mat_last_name : str = None
    file_number : int = None
    profile_image_path : str = None
    email : str = None
    password : str = None

class StudentSchema(StudentBase):
    id : int

class AdminBase(BaseModel):
    username : str
    email : str
    password : str

class AdminSchema(AdminBase):
    id : int

class UserForm(BaseModel):
    username: str
    password: str
    role: str  # Expecting "student" or "admin"

class II_HeredetaryHistory(BaseModel):
    id: int
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

class III_NonpathologicalPersonalHistory(BaseModel):
    id: int
    immunizations: str
    feeding: str
    sports: str
    smoking: str
    alcoholism: str
    drug_addictions: str
    house_conditions: str
    who_live_with_you: str
    how_many_people: str 
    how_many_rooms: str 
    work_and_school: str

class IV_PathologicalPersonalHistory(BaseModel):
    rash_diseases: str
    infectious_diseases: str
    traumas: str
    parasitic_diseases: str
    venereal_diseases: str
    chronic_diseases: str
    surgical_history: str
    nervous_system: str
    allergic_history: str
    psycho_history: str
    covid_19: str

class V_A_GynecologicalHistory(BaseModel):
    menarche: str
    menstrual_duration: str
    menstrual_rhythm: str
    dysmenorrhea: str
    were_pregnant: str
    contraceptive_methods: str
    pap_smear_test: str
    
class V_B_SexualHistory(BaseModel):
    active_sex_life: str
    sexual_partners_number: str
    sexual_orientation: str
    sexual_partners: str

#se pueden hacer booleanos
class VI_CurrentIllness(BaseModel):
    have_poor_health: bool
    bloody_diarrhea: bool
    weakness: bool
    pain: bool
    thristy: bool
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

class VII_OdontologicalHistory(BaseModel):
    dental_pieces_number: str
    dental_cleaning: str
    last_dental_checking: str
    dental_pain: str
    bloody_gums: str
    mouth_pain: str
    object_in_mouth: str
    current_dental_treatment: str

class VIII_Somatometry(BaseModel):
    weight: int
    size: int
    bmi: int
    heart_rate: int
    respiratory_rate: int
    blood_pressure: int
    temperature: int

class IX_OptometricExamination(BaseModel):
    do_you_wear_glasses: str

class X_SystemsReview(BaseModel):
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

class XI_ExternalAppearance(BaseModel):
    external_appearence: str

class XII_PhysicalExamination(BaseModel):
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

class I_IdentificationCard(BaseModel):
    id: int
    name: str = None
    pat_last_name: str = None
    mat_last_name: str = None
    age: str = None
    sex: str = None
    gender: str = None
    marital_status: str
    birth_place: str = None
    residence_place: str = None
    occupation: str = None
    phone_number: str = None
    study_date: str = None

class MedicalRecordBase(BaseModel):
    section_one_id : int = None
    section_two_id : int = None
    section_three_id : int = None

class MedicalRecordSchema(MedicalRecordBase):
    id : int




