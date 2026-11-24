import { useState, useCallback } from 'react';
import { deleteUserRequest } from '../../../../services/userService';
import { getErrorMessage } from '../../../../utils/errors';


// El backend no borra al usuario: lo desactiva (ya no puede iniciar sesión).
export default function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteUser = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteUserRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo desactivar el usuario.'));
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
