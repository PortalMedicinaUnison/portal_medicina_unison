import { useState, useEffect } from 'react';
import { getSurveyByIdRequest } from '../../../../services/surveyService';

export const useSurvey = (surveyId) => {
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSurveyById = async (id) => {
        if (!id || isNaN(parseInt(id))) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getSurveyByIdRequest(id);
            setSurvey(response.data);
            console.log('Survey fetched:', response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar la encuesta');
            console.error('Error fetching survey:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (surveyId) {
            getSurveyById(surveyId);
        }
    }, [surveyId]);

    // Función para refrescar los datos
    const refetch = () => {
        if (surveyId) {
            getSurveyById(surveyId);
        }
    };

    return {
        survey,
        loading,
        error,
        refetch,
        getSurveyById
    };
};
