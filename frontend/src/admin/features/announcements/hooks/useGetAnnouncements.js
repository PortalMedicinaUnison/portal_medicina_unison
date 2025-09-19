import { useState, useEffect, useCallback } from 'react';
import { getAllAnnouncementsRequest } from '../../../../services/announcementService'

const useGetAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const fetchAnnouncements = useCallback(async () => {
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
    fetchAnnouncements();
  }, [fetchAnnouncements]);
    
  return { announcements, loading, error, refetch: fetchAnnouncements };
};

export default useGetAnnouncements;