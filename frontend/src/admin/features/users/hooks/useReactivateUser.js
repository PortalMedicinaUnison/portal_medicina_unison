import { useState, useCallback } from 'react';
import { reactivateUserRequest } from '../../../../services/userService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useReactivateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const reactivateUser = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await reactivateUserRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo reactivar la cuenta.'));
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

  return { reactivateUser, loading, error, success, reset };
}
