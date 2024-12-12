// import MultiStep from 'react-multistep';
import { useState, useEffect } from "react";
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

function FormularioHistorialClinico() {

    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        <SeccionUno/>,
        <SeccionDos/>,
        <SeccionTres/>,
        <SeccionCuatro/>,
        <SeccionCinco/>,
        <SeccionSeis/>,
        <SeccionSiete/>,
        <SeccionOchoYNueve/>,
        <SeccionDiez/>,
        <SeccionOnceYDoce/>
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
    
    return (
        <div className="w-full max-w-3xl bg-white p-8 shadow-md rounded">
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