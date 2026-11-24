import { useState, useCallback } from 'react';
import { changeMyPasswordRequest } from '../../../services/userService';
import { setToken } from '../../../utils/auth';
import { getErrorMessage } from '../../../utils/errors';


export default function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  // data: { current_password, new_password, confirm_password }. Devuelve true si se cambió.
  const changePassword = useCallback(async (data) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // El backend cierra las demás sesiones y devuelve un token nuevo para esta.
      const { data: session } = await changeMyPasswordRequest(data);
      if (session?.access_token) setToken(session.access_token);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cambiar la contraseña.'));
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

  return { changePassword, loading, error, success, reset };
}
