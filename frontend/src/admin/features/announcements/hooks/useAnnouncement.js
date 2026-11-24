import { useState, useEffect, useCallback } from 'react';
import { getAnnouncementByIdRequest } from '../../../../services/communicationService';
import { getErrorMessage } from '../../../../utils/errors';


export default function useAnnouncement(id) {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const getAnnouncement = useCallback(async (id) => {
    if (!id) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAnnouncementByIdRequest(id);
      setAnnouncement(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
      setAnnouncement(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setAnnouncement(null);
      setError(null);
      setLoading(false);
      return;
    }
    getAnnouncement(id);
  }, [id, getAnnouncement]);

  const refetch = useCallback(() => {
    if (!id) return Promise.resolve();
    return getAnnouncement(id);
  }, [id, getAnnouncement]);

  return { announcement, loading, error, refetch, getAnnouncement };
};