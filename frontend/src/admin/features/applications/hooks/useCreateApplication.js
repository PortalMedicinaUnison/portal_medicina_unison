import { useState, useCallback } from 'react';
import { createInternshipApplicationRequest } from '../../../../services/internshipService';


export default function useCreateApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createApplication = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createInternshipApplicationRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating application');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createApplication, loading, error, success, reset };
}