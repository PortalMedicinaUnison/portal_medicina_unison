import { useState, useCallback } from 'react';
import { updateInternshipRequest } from '../../../../services/internshipService';
import { getErrorMessage } from '../../../../utils/errors';


// data: { site_id } o { status }. Devuelve la respuesta si se guardó (undefined si falló).
export default function useUpdateInternship() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateInternship = useCallback(async (id, data) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateInternshipRequest(id, data);
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

  return { updateInternship, loading, error, success, reset };
}
