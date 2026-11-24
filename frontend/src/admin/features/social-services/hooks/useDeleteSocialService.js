import { useState, useCallback } from 'react';
import { deleteSocialServiceRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


// Da de baja el servicio social; la asignación del alumno vuelve a quedar pendiente.
export default function useDeleteSocialService() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteSocialService = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteSocialServiceRequest(id);
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

  return { deleteSocialService, loading, success, error, reset };
}
