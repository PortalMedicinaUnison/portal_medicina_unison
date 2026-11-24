import { useState, useCallback } from 'react';
import { updateSocialServiceRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


// data: { site_id } o { status }. Devuelve la respuesta si se guardó (undefined si falló).
// El backend valida que la plaza tenga cupo en la promoción (400/409 con el motivo).
export default function useUpdateSocialService() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSocialService = useCallback(async (id, data) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateSocialServiceRequest(id, data);
      setSuccess(true);
      return response;
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

  return { updateSocialService, loading, error, success, reset };
}
