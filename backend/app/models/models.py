from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

# class Form(Base):
#     __tablename__ = "form"

#     id = Column(Integer, primary_key=True)
#     title = Column(String)
#     description = Column(String)
#     questions = relationship('Question', back_populates='form')
    
# class Question(Base):
#     __tablename__ = "question"

#     id = Column(Integer, primary_key=True)
#     title = Column(String)
#     description = Column(String)
#     type = Column(String)
#     form_id = Column(Integer, ForeignKey('form.id'))
#     form = relationship('Form', back_populates='questions')

class AcceptedStudent(Base):
    __tablename__ = "accepted_student"

    id = Column(Integer, primary_key=True)
    file_number = Column(Integer, unique=True)

class Student(Base):
    __tablename__ = "student"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    pat_last_name = Column(String)
    mat_last_name = Column(String)
    file_number = Column(Integer, unique=True)
    profile_image_path = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)


class I_IdentificationCard():
    file_number = Column(Integer)
    name = Column(String)
    pat_last_name = Column(String)
    mat_last_name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    marital_status = Column(String)
    birth_place = Column(String)
    residence_place = Column(String)
    occupation = Column(String)
    phone_number = Column(String)
    study_date = Column(String)

class II_HeredetaryHistory():
    alcoholism = Column(String)
    arthritis = Column(String)
    cancer = Column(String)
    heart_diseases = Column(String)
    depression = Column(String)
    diabetes = Column(String)
    obesity = Column(String)
    blood_pressure = Column(String)
    smoking = Column(String)
    other = Column(String)

class III_NonpathologicalPersonalHistory():
    immunizations = Column(String)
    feeding = Column(String)
    sports = Column(String)
    smoking = Column(String)
    alcoholism = Column(String)
    drug_addictions = Column(String)
    house_conditions = Column(String)
    who_live_with_you = Column(String)
    how_many_people = Column(String) 
    how_many_rooms = Column(String) 
    work_and_school = Column(String)

class IV_PathologicalPersonalHistory():
    rash_diseases = Column(String)
    infectious_diseases = Column(String)
    traumas = Column(String)
    parasitic_diseases = Column(String)
    venereal_diseases = Column(String)
    chronic_diseases = Column(String)
    surgical_history = Column(String)
    nervous_system = Column(String)
    allergic_history = Column(String)
    psycho_history = Column(String)
    covid_19 = Column(String)

class V_A_GynecologicalHistory():
    menarche = Column(String)
    menstrual_duration = Column(String)
    menstrual_rhythm = Column(String)
    dysmenorrhea = Column(String)
    were_pregnant = Column(String)
    contraceptive_methods = Column(String)
    pap_smear_test = Column(String)
    
class V_B_SexualHistory():
    active_sex_life = Column(String)
    sexual_partners_number = Column(String)
    sexual_orientation = Column(String)
    sexual_partners = Column(String)

#se pueden hacer booleanos
class VI_CurrentIllness():
    have_poor_health = Column(String)
    bloody_diarrhea = Column(String)
    weakness = Column(String)
    pain = Column(String)
    thristy = Column(String)
    convulsions = Column(String)
    fainting = Column(String)
    stomachache = Column(String)
    headache = Column(String)
    hearing_issues = Column(String)
    genital_issues = Column(String)
    weird_urine = Column(String)
    foot_cracks = Column(String)
    joint_issues = Column(String)
    nail_issues = Column(String)
    chest_pain = Column(String)
    unexplained_discomfort = Column(String)
    unexplained_fever = Column(String)
    weight_loss = Column(String)
    eternal_cough = Column(String)

class VII_OdontologicalHistory():
    dental_pieces_number = Column(String)
    dental_cleaning = Column(String)
    last_dental_checking = Column(String)
    dental_pain = Column(String)
    bloody_gums = Column(String)
    mouth_pain = Column(String)
    object_in_mouth = Column(String)
    current_dental_treatment = Column(String)

class VIII_Somatometry():
    weight = Column(Integer)
    size = Column(Integer)
    bmi = Column(Integer)
    heart_rate = Column(Integer)
    respiratory_rate = Column(Integer)
    blood_pressure = Column(Integer)
    temperature = Column(Integer)

class IX_OptometricExamination():
    do_you_wear_glasses = Column(String)

class X_SystemsReview():
    pass

class XI_ExternalAppearance():
    pass

class XII_PhysicalExamination():
    pass

class MedicalRecord(
    I_IdentificationCard,
    II_HeredetaryHistory,
    III_NonpathologicalPersonalHistory,
    IV_PathologicalPersonalHistory,
    V_A_GynecologicalHistory,
    V_B_SexualHistory,
    VI_CurrentIllness,
    VII_OdontologicalHistory,
    VIII_Somatometry,
    IX_OptometricExamination,
    X_SystemsReview,
    XI_ExternalAppearance,
    XII_PhysicalExamination
):
    __tablename__ = "medical_record"

    id = Column(Integer, primary_key=True)
    # i_identification_card = ForeignKey()

