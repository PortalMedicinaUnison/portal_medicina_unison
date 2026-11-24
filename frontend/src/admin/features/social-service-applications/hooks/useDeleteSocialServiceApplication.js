import { useState, useCallback } from 'react';
import { deleteSocialServiceApplicationRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


// El backend responde 409 si la asignación ya tiene un servicio social (hay que eliminarlo primero).
export default function useDeleteSocialServiceApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteApplication = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteSocialServiceApplicationRequest(id);
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

  return { deleteApplication, loading, success, error, reset };
}
