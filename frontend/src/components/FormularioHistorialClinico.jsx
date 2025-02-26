// import MultiStep from 'react-multistep';
import { useState, useEffect } from "react";
import api from "../api";
import SeccionUno from "./HistoriaClinica/SeccionUno";
import SeccionDos from "./HistoriaClinica/SeccionDos";
import SeccionTres from "./HistoriaClinica/SeccionTres";
import SeccionCuatro from "./HistoriaClinica/SeccionCuatro";
import SeccionCinco from "./HistoriaClinica/SeccionCinco";
import SeccionSeis from "./HistoriaClinica/SeccionSeis";
import SeccionSiete from "./HistoriaClinica/SeccionSiete";
import SeccionOchoYNueve from "./HistoriaClinica/SeccionOchoYNueve";
import SeccionDiez from "./HistoriaClinica/SeccionDiez";
import SeccionOnceYDoce from "./HistoriaClinica/SeccionOnceYDoce";

function FormularioHistorialClinico({user}) {

    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        section_one: {
            name: '',
            pat_last_name: '',
            mat_last_name: '',
            age: '',
            sex: 'Masculino',
            gender: 'Masculino',
            marital_status: 'Soltero',
            birth_place: '',
            residence_place: '',
            occupation: '',
            phone_number: '',
            study_date: '',
        },
        section_three: {
            inmunizaciones: '',
            alimentacion: {
                carne: false,
                leche: false,
                huevo: false,
                verdurasFrutas: false,
            },
            deportes: '',
            tabaquismo: {
                haFumado: '',
                masDe10: '',
                menosDe10: '',
            },
            alcoholismo: {
                bebidas: '',
                tresCopas: '',
                alMenosTresCopas: '',
                embriaguez: '',
            },
            toxicomanias: {
                drogas: '',
                frecuentes: '',
            },
            habitacion: {
                tipo: '',
                servicios: '',
            },
            convivencia: {
                conQuien: '',
                personas: '',
                cuartos: '',
            },
            empleo: {
                labura: '',
                detalles: '',
            }
        },
      });

    const steps = [
        <SeccionUno user={user} formData={formData} setFormData={setFormData}/>,
        <SeccionDos/>,
        <SeccionTres user={user} formData={formData} setFormData={setFormData}/>,
        <SeccionCuatro user={user} formData={formData} setFormData={setFormData}/>,
        // <SeccionTres/>,
        // <SeccionCuatro/>,
        // <SeccionCinco/>,
        // <SeccionSeis/>,
        // <SeccionSiete/>,
        // <SeccionOchoYNueve/>,
        // <SeccionDiez/>,
        // <SeccionOnceYDoce/>
    ];

    function handlePrevButtonClick(){
        setCurrentStep((prevStep) => prevStep - 1);
    }
    
    function handleNextButtonClick(){
        setCurrentStep((prevStep) => prevStep + 1);
    }
    
    function displayButtons(){

        const stepFormButtons = document.getElementById('step-form-buttons');
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        stepFormButtons.style.justifyContent = 'space-between';
        prevButton.style.display = 'block';
        nextButton.style.display = 'block';


        if(currentStep === 0){
            prevButton.style.display = 'none';
            stepFormButtons.style.justifyContent = 'flex-end';
        }
        if(currentStep === steps.length - 1){
            nextButton.style.display = 'none';
            stepFormButtons.style.justifyContent = 'flex-start';
        }
    }

    useEffect(() => {
        displayButtons();
    }, [currentStep]);

    const handleMedicalRecord = async (e) => {
        e.preventDefault();

        console.log(formData);
    
        // try {
        //   const response = await api.post("/medical_record/", medicalRecord);
        //   console.log(response);
        //   window.location.reload();
        // } catch (error) {
        //   console.error("Edit failed", error);
        // }
      };
    
    return (
        <div className="w-full max-w-3xl bg-white p-8 shadow-md rounded">
            <button onClick={handleMedicalRecord} className='next-button'>Guardar</button>
            <div id="step-form-buttons" className="step-form-buttons">
                <button id="prev-button" className="prev-button" onClick={handlePrevButtonClick}>
                Anterior
                </button>
                <button id="next-button" className="next-button" onClick={handleNextButtonClick}>
                Siguiente
                </button>
            </div>
            {steps[currentStep]}
        </div>
    );
}

export default FormularioHistorialClinico;