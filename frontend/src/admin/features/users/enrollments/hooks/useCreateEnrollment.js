import { useState, useCallback } from 'react';
import { createUserEnrollmentRequest } from '../../../../../services/userService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useCreateEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createEnrollment = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createUserEnrollmentRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el registro.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createEnrollment, loading, error, success, reset };
}