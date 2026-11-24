import { useState, useCallback } from 'react';
import { deactivateMeRequest } from '../../../services/userService';
import { getErrorMessage } from '../../../utils/errors';


export default function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  // Desactiva la cuenta en sesión.
  const deleteUser = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deactivateMeRequest();
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo desactivar la cuenta.'));
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

  return { deleteUser, loading, success, error, reset };
};