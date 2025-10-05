import { useState, useCallback } from 'react';
import { updateInternshipRequest } from '../../../../services/internshipService';


export default function useUpdateInternship() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateInternship = useCallback(async (id, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateInternshipRequest(id, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating internship');
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