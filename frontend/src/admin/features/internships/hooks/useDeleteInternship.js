import { useState, useCallback } from 'react';
import { deleteInternshipRequest } from '../../../../services/internshipService';


export default function useDeleteInternship() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteInternship = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteInternshipRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting internship');
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

  return { deleteInternship, loading, success, error, reset };
};