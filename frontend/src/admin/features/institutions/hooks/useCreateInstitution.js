import { useState, useCallback } from 'react';
import { createInstitutionRequest } from '../../../../services/siteService';


export default function useCreateInstitution() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createInstitution = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createInstitutionRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating institution');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createInstitution, loading, error, success, reset };
}