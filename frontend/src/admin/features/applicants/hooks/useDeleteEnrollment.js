import { useState } from 'react';
import { deleteEnrollmentRequest } from '../../../../services/internshipService';

export default function useDeleteEnrollment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const deleteEnrollment = async (id) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await deleteEnrollmentRequest(id);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Delete failed', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setSuccess(false);
    setError('');
  };

  return { deleteEnrollment, loading, success, error, reset };
}
