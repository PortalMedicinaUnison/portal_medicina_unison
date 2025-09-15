import { useParams, useNavigate } from 'react-router-dom';
import { useSurvey } from '../hooks/useSurvey';

function SurveyDetail() {
    const { surveyId } = useParams();
    const navigate = useNavigate();
    // Usamos el hook para obtener la encuesta por su ID
    const { survey, loading, error } = useSurvey(parseInt(surveyId));

    const handleDeleteSurvey = () => {
        const userConfirmed = confirm('¿Estás seguro de que deseas eliminar esta encuesta?');
        if (userConfirmed) {
            // Aquí iría la lógica para llamar a la API y eliminar la encuesta
            console.log('Deleting survey:', surveyId);
            // Ejemplo: api.delete(`/surveys/${surveyId}`).then(() => navigate('/surveys'));
        }
    };

    return (
        <div>
            {loading && (
                <span className="text-xs text-gray-500">Cargando información de la encuesta...</span>
            )}

            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <h3>Error al cargar la encuesta</h3>
                        <p>{error}</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/surveys')} // Ajusta la ruta si es necesario
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            )}

            {survey ? (
                <div className="info-container">
                    <div className="item-container">
                        <dl className="item-list">
                            <div className="item-row">
                                <dt className="item-header">Título de la encuesta</dt>
                                <dd className="item-text">{survey.title}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Descripción</dt>
                                <dd className="item-text">{survey.description || 'Sin descripción'}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Enlace Web</dt>
                                <dd className="item-text">
                                    <a href={survey.web_link} target="_blank" rel="noopener noreferrer" className="item-link">
                                        {survey.web_link}
                                    </a>
                                </dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Fecha de Expiración</dt>
                                <dd className="item-text">{new Date(survey.expiration_date).toLocaleDateString()}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Obligatoria</dt>
                                <dd className="item-text">{survey.mandatory ? 'Sí' : 'No'}</dd>
                            </div>

                            <div className="item-row">
                                <dt className="item-header">Creado por (ID)</dt>
                                <dd className="item-text">{survey.created_by}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="info-actions mt-16">
                        <button 
                            type="button" 
                            className='item-link-danger'
                            onClick={handleDeleteSurvey}
                        >
                            Eliminar Encuesta
                        </button>
                    </div>
                </div>
            ) : !loading && (
                <span className="text-xs text-gray-500">Encuesta no encontrada</span>
            )}
        </div>
    );
}

export default SurveyDetail;
