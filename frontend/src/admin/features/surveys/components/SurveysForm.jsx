// SurveyForm.jsx
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useCreateSurvey from '../hooks/useCreateSurvey';
import { ROUTES, adminAbs } from '../../../../config';

function SurveyForm() {
    const navigate = useNavigate();
    // Suponiendo que el ID del admin se obtiene de algún estado global o contexto
    const created_by = 1; 

    const [formData, setFormData] = useState({
        title: '',
        web_link: '',
        description: '',
        expiration_date: '',
        mandatory: false,
        created_by: created_by,
    });
    
    // Hook para la lógica de creación
    const { createSurvey, error, success } = useCreateSurvey();
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // El payload ya coincide con el modelo SurveyInput
        const isCreated = await createSurvey(formData);
        
        if (isCreated) {
            console.log('Encuesta registrada exitosamente');
            // Redirige a la lista de encuestas
            navigate(adminAbs(ROUTES.ADMIN.SURVEYS_LIST));
        }
    };
    
    return (
        <form className="component-container" onSubmit={handleSubmit}>
            {success && (
                <div className="alert-success-text">
                    Encuesta registrada exitosamente.
                </div>
            )}

            {error && (
                <div className="alert-footer-text">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="info-container">
                <div className="item-container">
                    <dl className="item-list">
                        {/* Título */}
                        <div className="item-row">
                            <dt className="item-header">Título</dt>
                            <dd className="item-text">
                                <input
                                    className="form-input--half"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Título de la encuesta"
                                    required
                                />
                            </dd>
                        </div>

                        {/* Enlace Web */}
                        <div className="item-row">
                            <dt className="item-header">Enlace Web</dt>
                            <dd className="item-text">
                                <input
                                    className="form-input--half"
                                    name="web_link"
                                    type="url"
                                    value={formData.web_link}
                                    onChange={handleChange}
                                    placeholder="https://ejemplo.com/encuesta"
                                    required
                                />
                            </dd>
                        </div>
                        
                        {/* Descripción */}
                        <div className="item-row">
                            <dt className="item-header">Descripción</dt>
                            <dd className="item-text">
                                <textarea
                                    className="form-input--half"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descripción corta de la encuesta (opcional)"
                                    rows="3"
                                />
                            </dd>
                        </div>

                        {/* Fecha de Expiración */}
                        <div className="item-row">
                            <dt className="item-header">Fecha de Expiración</dt>
                            <dd className="item-text">
                                <input
                                    className="form-input--half"
                                    name="expiration_date"
                                    type="date"
                                    value={formData.expiration_date}
                                    onChange={handleChange}
                                    required
                                />
                            </dd>
                        </div>

                        {/* Obligatoria */}
                        <div className="item-row">
                            <dt className="item-header">Obligatoria</dt>
                            <dd className="item-text">
                                <input
                                    className="form-checkbox"
                                    name="mandatory"
                                    type="checkbox"
                                    checked={formData.mandatory}
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Marcar si la encuesta es obligatoria</span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="button-group">
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => navigate(adminAbs(ROUTES.ADMIN.SURVEYS_LIST))}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary"
                    >
                        Guardar Encuesta
                    </button>
                </div>
            </div>
        </form>
    );
}

export default SurveyForm;
