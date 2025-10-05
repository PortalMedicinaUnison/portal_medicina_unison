import { useState, useCallback } from 'react';
import { createAnnouncementRequest } from '../../../../services/communicationService';


export default function useCreateAnnouncement() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);    

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createAnnouncement = useCallback(async (payload) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createAnnouncementRequest(payload);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating announcement');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createAnnouncement, loading, error, success, reset };
}