import { useState } from 'react';
import { createSurveyRequest } from '../../../../services/surveyService';

export default function useCreateSurvey() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createSurvey = async (surveyData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await createSurveyRequest(surveyData);
            console.log('Survey created:', response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al crear la encuesta');
            console.error('Error creating survey:', err);
            throw err; // Re-throw the error for further handling if needed
        } finally {
            setLoading(false);
        }
    };

    return {
        createSurvey,
        loading,
        error,
    };
}
