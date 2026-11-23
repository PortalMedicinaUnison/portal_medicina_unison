import { useState, useEffect, useCallback } from 'react';
import { getAllAnnouncementsRequest } from '../../../../services/communicationService'
import { getErrorMessage } from '../../../../utils/errors';


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
      setError(getErrorMessage(err, 'No se pudo cargar la información.'));
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