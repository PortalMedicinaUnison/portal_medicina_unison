import { useState, useCallback } from 'react';
import { updateMeRequest } from '../../../services/userService';
import { getErrorMessage } from '../../../utils/errors';


export default function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  // Siempre actualiza la cuenta en sesión (PATCH /users/me). Devuelve true si se guardó.
  const updateUser = useCallback(async (payload) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateMeRequest(payload);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los cambios.'));
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { updateUser, loading, error, success, reset };
}
