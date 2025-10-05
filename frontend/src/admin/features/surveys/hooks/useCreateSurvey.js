import { useState, useCallback } from 'react';
import { createSurveyRequest } from '../../../../services/communicationService';


export default function useCreateSurvey() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createSurvey = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createSurveyRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating survey');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createSurvey, loading, error, success, reset };
}