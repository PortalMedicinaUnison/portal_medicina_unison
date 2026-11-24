import { useState, useEffect, useCallback } from 'react';
import { getAllSurveysRequest } from '../../../../services/communicationService';
import { getErrorMessage } from '../../../../utils/errors';


// A un estudiante el backend solo le devuelve encuestas visibles y vigentes.
export default function useGetSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const getSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllSurveysRequest();
      setSurveys(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSurveys();
  }, [getSurveys]);

  return { surveys, loading, error, refetch: getSurveys };
}
