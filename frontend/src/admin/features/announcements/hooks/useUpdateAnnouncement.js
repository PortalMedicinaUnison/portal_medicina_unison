import { useState, useCallback } from 'react';
import { updateAnnouncementRequest } from '../../../../services/communicationService';


export default function useUpdateAnnouncement() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateAnnouncement = useCallback(async (announcementID, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAnnouncementRequest(announcementID, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating announcement');
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

  return { updateAnnouncement, loading, error, success, reset };
}