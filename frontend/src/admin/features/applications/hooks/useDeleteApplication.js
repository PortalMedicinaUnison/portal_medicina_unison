import { useState, useCallback } from 'react';
import { deleteInternshipApplicationRequest } from '../../../../services/internshipService';


export default function useDeleteApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteApplication = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteInternshipApplicationRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting application');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  }, []);

  return { deleteApplication, loading, success, error, reset };
};