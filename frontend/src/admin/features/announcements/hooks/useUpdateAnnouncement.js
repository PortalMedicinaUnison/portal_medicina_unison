import { useState, useCallback } from 'react';
import { updateAnnouncementRequest } from '../../../../services/communicationService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useUpdateAnnouncement() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateAnnouncement = useCallback(async (id, payload) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAnnouncementRequest(id, payload);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los cambios.'));
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