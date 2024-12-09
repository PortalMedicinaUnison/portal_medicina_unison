// import MultiStep from 'react-multistep';
import { useState } from "react";
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

// function SeccionUno() {
//     return (
//         <div>
//             <h2>Sección 1</h2>
//             <label><b>Name: </b></label>
//             <input type="text" />
//             <label><b>Last name: </b></label>
//             <input type="text" />
//         </div>
//     );
// }

// function SeccionDos() {
//     return (
//         <div>
//             <h2>Sección 2</h2>
//             <label><b>Color: </b></label>
//             <input type="text" />
//             <label><b>Shape: </b></label>
//             <input type="text" />
//         </div>
//     );
// }

function FormularioHistorialClinico() {

    const [currentStep, setCurrentStep] = useState(1);

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
        <SeccionOnceYDoce/>,
    ];
    
    return (
        // <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-3xl bg-white p-8 shadow-md rounded">
            <div className="flex justify-center">
                <button
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={currentStep === 1}
                >
                Previous
                </button>
                <button
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={currentStep === steps.length}
                >
                Next
                </button>
            </div>
            {steps[currentStep - 1]}
        </div>
    );
}

export default FormularioHistorialClinico;