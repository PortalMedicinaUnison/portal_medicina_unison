from sqlalchemy import Column, Integer, Boolean, String, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

class MedicalRecord(Base):
    """
    Modelo principal para los historiales médicos.
    """
    
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False) #REVISAR

    student = relationship("Student", back_populates="medical_record")
    identification_card = relationship("IdentificationCard", back_populates="medical_record", uselist=False)
    family_medical_history = relationship("FamilyMedicalHistory", back_populates="medical_record", uselist=False)
    non_pathological_history = relationship("NonPathologicalHistory", back_populates="medical_record", uselist=False)
    pathological_history = relationship("PathologicalHistory", back_populates="medical_record", uselist=False)
    gynecological_history = relationship("GynecologicalHistory", back_populates="medical_record", uselist=False)
    sexual_history = relationship("SexualHistory", back_populates="medical_record", uselist=False)
    current_illness = relationship("CurrentIllness", back_populates="medical_record", uselist=False)
    odontological_history = relationship("OdontologicalHistory", back_populates="medical_record", uselist=False)
    somatometry = relationship("Somatometry", back_populates="medical_record", uselist=False)
    systems_reviews = relationship("SystemsReview", back_populates="medical_record", uselist=False)
    physical_examination = relationship("PhysicalExamination", back_populates="medical_record", uselist=False)

class IdentificationCard(Base):
    """
    Modelo para información básica del estudiante.
    """

    __tablename__ = "identification_cards"

    id = Column(Integer, primary_key=True, index=True)
    academic_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    paternal_last_name = Column(String(100), nullable=False)
    maternal_last_name = Column(String(100))
    age = Column(Integer, nullable=False)
    sex = Column(String(10), nullable=False)
    gender = Column(String(20), nullable=False)
    marital_status = Column(String(15), nullable=False)
    birth_place = Column(String(100), nullable=False)
    residence_place = Column(String(100), nullable=False)
    occupation = Column(String(100), nullable=False)
    phone_number = Column(String(10), nullable=False)
    study_date = Column(String(20), nullable=False)

    medical_record = relationship("MedicalRecord", back_populates="identification_card")

class FamilyMedicalHistory(Base):
    """
    Modelo para padeceimientos hereditarios.
    """

    __tablename__ = "family_medical_history"

    id = Column(Integer, primary_key=True, index=True)
    alcoholism = Column(String(10))
    arthritis = Column(String(10))
    cancer = Column(String(10))
    heart_diseases = Column(String(10))
    depression = Column(String(10))
    diabetes = Column(String(10))
    obesity = Column(String(10))
    blood_pressure = Column(String(10))
    smoking = Column(String(10))
    other = Column(String(10))

    medical_record = relationship("MedicalRecord", back_populates="family_medical_history")

class NonPathologicalHistory(Base):
    __tablename__ = "non_pathological_histories"

    id = Column(Integer, primary_key=True, index=True)
    immunizations = Column(String(20), nullable=False)
    feeding = Column(String(20), nullable=False)
    sports = Column(String(30), nullable=False)
    smoking = Column(String(30), nullable=False)
    alcoholism = Column(String(30), nullable=False)
    drug_addictions = Column(String(30), nullable=False)
    housing_status = Column(String(10), nullable=False)
    house_conditions = Column(String(20), nullable=False)
    who_live_with_you = Column(String(10), nullable=False)
    how_many_people = Column(String(10), nullable=False)
    how_many_rooms = Column(String(10), nullable=False)
    work_and_school = Column(Boolean)
    work_and_school_details = Column(String(30))

    medical_record = relationship("MedicalRecord", back_populates="non_pathological_history")

class PathologicalHistory(Base):
    __tablename__ = "pathological_histories"

    id = Column(Integer, primary_key=True, index=True)

    eruptive_diseases = Column(String(30), default=None)
    
    infectious_diseases = Column(String(30), default=None)
    
    traumas = Column(String(30), default=None)
    
    blood_transfusion = Column(Boolean, nullable=False)
    blood_transfusion_date = Column(String(30))
    
    parasitic_diseases = Column(Boolean, nullable=False)
    
    venereal_diseases = Column(Boolean, nullable=False)
    venereal_diseases_details = Column(String(30))
    
    chronic_diseases = Column(String(30), nullable=False)
    chronic_diseases_details = Column(String(30))
    
    surgeries = Column(Boolean, nullable=False)
    surgeries_details = Column(String(30))

    nervous_breakdown = Column(Boolean, nullable=False)
    nervous_paralisys = Column(Boolean, nullable=False)

    allergic_history = Column(String(30), nullable=False)
    allergic_history_details = Column(String(30))

    psychological_treatment = Column(Boolean, nullable=True)
    psychiatric_treatment = Column(Boolean, nullable=True)
    psychological_treatment_current = Column(Boolean, nullable=True)
    psychiatric_treatment_current = Column(Boolean, nullable=True)
    suicidal_thoughts = Column(Boolean, nullable=True)

    covid = Column(Boolean, nullable=True)
    covid_date = Column(String(30))
    covid_symptoms = Column(String(50))
    covid_vaccine = Column(Boolean, nullable=True)



    medical_record = relationship("MedicalRecord", back_populates="pathological_history")

class GynecologicalHistory(Base):
    __tablename__ = "gynecological_histories"

    id = Column(Integer, primary_key=True, index=True)
    menarche = Column(String)
    menstrual_duration = Column(String)
    menstrual_rhythm = Column(String)
    dysmenorrhea = Column(String)
    were_pregnant = Column(String)
    contraceptive_methods = Column(String)
    pap_smear_test = Column(String)

    medical_record = relationship("MedicalRecord", back_populates="gynecological_history")
    
class SexualHistory(Base):
    __tablename__ = "sexual_histories"

    id = Column(Integer, primary_key=True, index=True)
    active_sex_life = Column(String)
    sexual_partners_number = Column(String)
    sexual_orientation = Column(String)
    sexual_partners = Column(String)

    medical_record = relationship("MedicalRecord", back_populates="sexual_history")

#se pueden hacer Booleanos
class CurrentIllness(Base):
    __tablename__ = "current_illnesses"

    id = Column(Integer, primary_key=True, index=True)
    have_poor_health = Column(Boolean)
    bloody_diarrhea = Column(Boolean)
    weakness = Column(Boolean)
    pain = Column(Boolean)
    thristy = Column(Boolean)
    convulsions = Column(Boolean)
    fainting = Column(Boolean)
    stomachache = Column(Boolean)
    headache = Column(Boolean)
    hearing_issues = Column(Boolean)
    genital_issues = Column(Boolean)
    weird_urine = Column(Boolean)
    foot_cracks = Column(Boolean)
    joint_issues = Column(Boolean)
    nail_issues = Column(Boolean)
    chest_pain = Column(Boolean)
    unexplained_discomfort = Column(Boolean)
    unexplained_fever = Column(Boolean)
    weight_loss = Column(Boolean)
    eternal_cough = Column(Boolean)

    medical_record = relationship("MedicalRecord", back_populates="current_illness")

class OdontologicalHistory(Base):
    __tablename__ = "odontological_histories"

    id = Column(Integer, primary_key=True, index=True)
    dental_pieces_number = Column(String)
    dental_cleaning = Column(String)
    last_dental_checking = Column(String)
    dental_pain = Column(String)
    bloody_gums = Column(String)
    mouth_pain = Column(String)
    object_in_mouth = Column(String)
    current_dental_treatment = Column(String)

    medical_record = relationship("MedicalRecord", back_populates="odontological_history")

class Somatometry(Base):
    __tablename__ = "somatometries"

    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Integer)
    size = Column(Integer)
    bmi = Column(Integer)
    heart_rate = Column(Integer)
    respiratory_rate = Column(Integer)
    blood_pressure = Column(Integer)
    temperature = Column(Integer)

    medical_record = relationship("MedicalRecord", back_populates="somatometry")

class SystemsReview(Base):
    __tablename__ = "systems_reviews"

    id = Column(Integer, primary_key=True, index=True)
    digestive_abdomen_shape = Column(Boolean)
    digestive_hernias = Column(Boolean)
    digestive_diarreas = Column(Boolean)
    digestive_other_illnesses = Column(Boolean)
    respiratory_nose_shape = Column(Boolean)
    respiratory_clean_fields = Column(Boolean)
    respiratory_chest_shape = Column(Boolean)
    respiratory_chronic_cough = Column(Boolean)
    respiratory_asthma = Column(Boolean)
    respiratory_other_illnesses = Column(Boolean)
    cardiovascular_noises = Column(Boolean)
    cardiovascular_murmurs = Column(Boolean)
    cardiovascular_arrhythmias = Column(Boolean)
    cardiovascular_dyspnoea = Column(Boolean)
    cardiovascular_other_illnesses = Column(Boolean)
    urinary_urine_smell = Column(Boolean)
    urinary_urine_appearence = Column(Boolean)
    urinary_pain = Column(Boolean)
    urinary_wishes_to_urinate = Column(Boolean)
    urinary_other_illnesses = Column(Boolean)
    male_genitals_penis_retraction = Column(Boolean)
    male_genitals_scrotum_pain = Column(Boolean)
    male_genitals_testicles_in_scrotum = Column(Boolean)
    female_genitals_have_you_menstruate = Column(Boolean)
    female_genitals_regular_menstruation = Column(Boolean)
    female_genitals_are_genital_and_tits_normal = Column(Boolean)
    nervous_system_nervous_tics = Column(Boolean)
    nervous_system_convulsions = Column(Boolean)
    nervous_system_headache = Column(Boolean)
    nervous_system_sleep_well = Column(Boolean)
    nervous_system_other_illnesses = Column(Boolean)
    skeletal_muscular_normal_posture = Column(Boolean)
    skeletal_muscular_scoliosis = Column(Boolean)
    skeletal_muscular_polio_after_effects = Column(Boolean)
    skeletal_muscular_plane_foot = Column(Boolean)
    skeletal_muscular_other_illnesses = Column(Boolean)
    endocrine_normal_weight = Column(Boolean)
    endocrine_overweight = Column(Boolean)
    endocrine_underweight = Column(Boolean)

    medical_record = relationship("MedicalRecord", back_populates="systems_reviews")

class PhysicalExamination(Base):
    __tablename__ = "physical_examination"

    id = Column(Integer, primary_key=True, index=True)
    external_appearence = Column(String)
    do_you_wear_glasses = Column(String)
    head = Column(String)
    neck = Column(String)
    chest = Column(String)
    abdomen = Column(String)
    genitals = Column(String)
    limbs = Column(String)
    lab_exam = Column(String)
    therapeutics_used = Column(String)
    diagnosis = Column(String)
    treatment = Column(String)

    medical_record = relationship("MedicalRecord", back_populates="physical_examination")

