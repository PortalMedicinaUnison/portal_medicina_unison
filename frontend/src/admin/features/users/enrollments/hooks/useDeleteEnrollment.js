import { useState, useCallback } from 'react';
import { deleteUserEnrollmentRequest } from '../../../../../services/userService';


export default function useDeleteEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteEnrollment = useCallback(async (id) => {
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await deleteUserEnrollmentRequest(id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting user enrollment');
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

  return { deleteEnrollment, loading, success, error, reset };
};