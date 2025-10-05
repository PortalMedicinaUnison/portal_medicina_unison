import { useState, useCallback } from 'react';
import { createInternshipRequest } from '../../../../services/internshipService';


export default function useCreateInternship() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createInternship = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createInternshipRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating internship');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createInternship, loading, error, success, reset };
}