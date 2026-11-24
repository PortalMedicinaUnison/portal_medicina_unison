import { useState, useCallback } from 'react';
import { deletePsdRequest } from '../../../../../services/promotionService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useDeletePsd() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deletePsd = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deletePsdRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el registro.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  }, []);

  return { deletePsd, loading, success, error, reset };
};