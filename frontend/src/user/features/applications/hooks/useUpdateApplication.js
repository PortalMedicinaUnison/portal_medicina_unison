import { useState, useCallback } from 'react';
import { updateInternshipApplicationRequest } from '../../../../services/internshipService';


export default function useUpdateApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateApplication = useCallback(async (id, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateInternshipApplicationRequest(id, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating application');
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

  return { updateApplication, loading, error, success, reset };
}