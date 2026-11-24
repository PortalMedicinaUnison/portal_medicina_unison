import { useState, useEffect, useCallback } from 'react';
import { getSocialServiceByIdRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useSocialService(id) {
  const [socialService, setSocialService] = useState(null);
  const [loading, setLoading]             = useState(Boolean(id));
  const [error, setError]                 = useState(null);

  const getSocialService = useCallback(async (socialServiceId) => {
    if (!socialServiceId) return Promise.resolve();
    setLoading(true);
    setError(null);

    try {
      const response = await getSocialServiceByIdRequest(socialServiceId);
      setSocialService(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setSocialService(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setSocialService(null);
      setError(null);
      setLoading(false);
      return;
    }
    getSocialService(id);
  }, [id, getSocialService]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getSocialService(id);
  }, [id, getSocialService]);

  return { socialService, loading, error, refetch, getSocialService };
}
