import { useState } from 'react';
import { deleteUserEnrollmentRequest } from '../../../../../services/userService';

export default function useDeleteUserEnrollment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const deleteUserEnrollment = async (id) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await deleteUserEnrollmentRequest(id);
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

  return { deleteUserEnrollment, loading, success, error, reset };
}
