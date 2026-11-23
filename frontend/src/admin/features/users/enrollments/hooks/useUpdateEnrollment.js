import { useState, useCallback } from 'react';
import { updateUserEnrollmentRequest } from '../../../../../services/userService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useUpdateEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateEnrollment = useCallback(async (id, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserEnrollmentRequest(id, formData);
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

  return { updateEnrollment, loading, error, success, reset };
}