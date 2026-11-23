import { useState, useCallback } from 'react';
import { registerRequest } from '../../../services/authService';
import { getErrorMessage } from '../../../utils/errors';


export default function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const signUpUser = useCallback(async (payload) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await registerRequest(payload);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo completar el registro.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { signUpUser, loading, error, success, reset };
}
