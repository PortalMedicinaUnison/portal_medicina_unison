import { useState, useEffect, useCallback } from 'react';
import { getAllAnnouncementsRequest } from '../../../../services/communicationService'


export default function useGetAnnouncements () {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const getAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllAnnouncementsRequest();
      setAnnouncements(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching announcements');
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getAnnouncements();
  }, [getAnnouncements]);
    
  return { announcements, loading, error, refetch: getAnnouncements };
};