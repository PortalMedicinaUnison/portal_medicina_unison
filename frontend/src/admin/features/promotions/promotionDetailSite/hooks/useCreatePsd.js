import { useState, useCallback } from 'react';
import { createPsdRequest } from '../../../../../services/promotionService';


export default function useCreatePsd() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createPsd = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createPsdRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating promotion site detail');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createPsd, loading, error, success, reset };
}