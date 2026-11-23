import { useState, useCallback } from 'react';
import { updateMeRequest } from '../../../services/userService';
import { getErrorMessage } from '../../../utils/errors';


export default function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  // `_id` se conserva por compatibilidad: siempre se actualiza la cuenta en sesión.
  const updateUser = useCallback(async (_id, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateMeRequest(formData);
      setSuccess(true);
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

  return { updateUser, loading, error, success, reset };
}