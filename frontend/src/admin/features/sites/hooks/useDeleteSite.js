import { useState } from 'react';
import { deleteSiteRequest } from '../../../../services/siteService';

export default function useDeleteSite() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const deleteSite = async (id) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await deleteSiteRequest(id);
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

  return { deleteSite, loading, success, error, reset };
}
