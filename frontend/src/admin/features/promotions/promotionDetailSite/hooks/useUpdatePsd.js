import { useState, useCallback } from 'react';
import { updatePsdRequest } from '../../../../../services/promotionService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useUpdatePsd() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updatePsd = useCallback(async (id, formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updatePsdRequest(id, formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los cambios.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { updatePsd, loading, error, success, reset };
}
