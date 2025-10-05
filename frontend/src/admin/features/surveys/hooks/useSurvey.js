import { useState, useEffect, useCallback } from 'react';
import { getSurveyByIdRequest } from '../../../../services/communicationService';


export default function useSurvey(id) {
  const [survey, setSurvey]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getSurvey = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSurveyByIdRequest(id);
      setSurvey(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching survey');
      setSurvey(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setSurvey(null);
      setError(null);
      setLoading(false);
      return;
    }
    getSurvey(id);
  }, [id, getSurvey]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getSurvey(id);
  }, [id, getSurvey]);

  return { survey, loading, error, refetch, getSurvey };
};