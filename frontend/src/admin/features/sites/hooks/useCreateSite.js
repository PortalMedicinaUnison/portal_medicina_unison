import { useState, useCallback } from 'react';
import { createSiteRequest } from '../../../../services/siteService';


export default function useCreateSite() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createSite = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createSiteRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating site');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createSite, loading, error, success, reset };
}