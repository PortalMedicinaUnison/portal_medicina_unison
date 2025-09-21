import { useState, useCallback } from 'react';
import { cleanFormData } from '../../../../utils/utils';
import { updateAnnouncementRequest } from '../../../../services/announcementService';


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
      const cleanedFormData = cleanFormData(formData);
      await updateAnnouncementRequest(announcementID, cleanedFormData);
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