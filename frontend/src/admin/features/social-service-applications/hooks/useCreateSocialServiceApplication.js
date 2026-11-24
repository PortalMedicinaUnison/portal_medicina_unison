import { useState, useCallback } from 'react';
import { createSocialServiceApplicationRequest } from '../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../utils/errors';


// data: { promotion_id, academic_id }. El backend responde 409 si el alumno no ha acreditado el internado,
// ya tiene un servicio social en curso o ya tiene una asignación en la promoción.
export default function useCreateSocialServiceApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createApplication = useCallback(async (data) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createSocialServiceApplicationRequest(data);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el registro.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createApplication, loading, error, success, reset };
}
