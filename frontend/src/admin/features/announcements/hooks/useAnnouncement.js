import { useState, useEffect, useCallback } from 'react';
import { getAnnouncementByIdRequest } from '../../../../services/announcementService';


export default function useAnnouncement(announcementId) {
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
      setError(err.response?.data?.detail || 'Error loading announcement');
      setAnnouncement(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!announcementId) {
      setAnnouncement(null);
      setError(null);
      setLoading(false);
      return;
    }
    getAnnouncement(announcementId);
  }, [announcementId, getAnnouncement]);

  const refetch = useCallback(() => {
    if (!announcementId) return Promise.resolve();
    return getAnnouncement(announcementId);
  }, [announcementId, getAnnouncement]);

  return { announcement, loading, error, refetch, getAnnouncement };
};