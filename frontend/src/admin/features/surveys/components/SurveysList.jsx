// SurveysList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api'; // Asegúrate que la ruta del API es correcta
import { ROUTES, adminAbs } from '../../../../config.js'; // Asegúrate que la ruta de config es correcta

function SurveysList() {
    const [search, setSearch] = useState('');
    const [surveys, setSurveys] = useState([]);
    const navigate = useNavigate();

    const getSurveys = async () => {
        try {
            const response = await api.get("/surveys/"); // Endpoint para encuestas
            setSurveys(response.data);
            console.log("Surveys loaded successfully", response.data);
        } catch (error) {
            console.error("Error loading surveys", error);
        }
    };
    
    useEffect(() => {
        getSurveys();
    }, []);
    
    const handleViewButton = (surveyId) => {
        // Navega al detalle de la encuesta
        navigate(adminAbs(ROUTES.ADMIN.SURVEY_DETAIL(surveyId)));
    };
    
    const handleDeleteButton = (surveyId) => {
        const deleteSurvey = async () => {
            try {
                await api.delete(`/surveys/${surveyId}`);
                await getSurveys(); // Refresca la lista después de borrar
            } catch (error) {
                console.error("Delete failed", error);
            }
        };

        const userConfirmed = confirm('Esta encuesta se eliminará. ¿Deseas continuar?');
        if (userConfirmed) {
            deleteSurvey();
        }
    };

    // Formatea la fecha para mejor legibilidad
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="table-container">
            <div className="table-container-actions">
                <input className='form-input--sm'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar por título'
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Enlace</th>
                        <th>Fecha de Expiración</th>
                        <th>Obligatoria</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {surveys.filter((survey) => {
                        return survey.title.toLowerCase().includes(search.toLowerCase());
                        })
                        .map((survey) => (
                            <tr key={survey.survey_id}>
                                <td>{survey.title}</td>
                                <td><a href={survey.web_link} target="_blank" rel="noopener noreferrer" className="item-link">Abrir enlace</a></td>
                                <td>{formatDate(survey.expiration_date)}</td>
                                <td>{survey.mandatory ? 'Sí' : 'No'}</td>
                                <td className="flex gap-4">
                                    <button className='item-link' onClick={() => handleViewButton(survey.survey_id)}>
                                        Ver
                                    </button>
                                </td>
                                <td>
                                    <button className='item-link-danger' onClick={() => handleDeleteButton(survey.survey_id)}>
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default SurveysList;
