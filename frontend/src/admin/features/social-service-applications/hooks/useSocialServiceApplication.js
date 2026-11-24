import { useState, useEffect, useCallback } from 'react';
import { getSocialServiceApplicationByIdRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useSocialServiceApplication(id) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading]         = useState(Boolean(id));
  const [error, setError]             = useState(null);

  const getApplication = useCallback(async (applicationId) => {
    if (!applicationId) return Promise.resolve();
    setLoading(true);
    setError(null);

    try {
      const response = await getSocialServiceApplicationByIdRequest(applicationId);
      setApplication(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setApplication(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setApplication(null);
      setError(null);
      setLoading(false);
      return;
    }
    getApplication(id);
  }, [id, getApplication]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getApplication(id);
  }, [id, getApplication]);

  return { application, loading, error, refetch, getApplication };
}
