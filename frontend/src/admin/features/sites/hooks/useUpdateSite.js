import { useState, useCallback } from 'react';
import { updateSiteRequest } from '../../../../services/siteService';


export default function useUpdateSite() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSite = useCallback(async (id, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateSiteRequest(id, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating site');
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

  return { updateSite, loading, error, success, reset };
}