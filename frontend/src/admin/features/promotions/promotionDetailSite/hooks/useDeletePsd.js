import { useState } from 'react';
import { deletePsdRequest } from '../../../../../services/promotionService';

export default function useDeletePsd() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const deletePsd = async (id) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await deletePsdRequest(id);
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

  return { deletePsd, loading, success, error, reset };
}
