import { useState, useEffect, useCallback } from 'react';
import { getAnnouncementByIdRequest } from '../../../../services/announcementService';

export const useAnnouncement = (announcementId) => {
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState(null);

    const fetchAnnouncement = useCallback(async (id) => {
        if (!id) return Promise.resolve();
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getAnnouncementByIdRequest(id);
            setAnnouncement(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error loading announcement');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (announcementId) {
          fetchAnnouncement(announcementId);
        }
      }, [announcementId, fetchAnnouncement]);
    
      const refetch = useCallback(() => {
        if (!announcementId) return Promise.resolve();
        return fetchAnnouncement(announcementId)
      }, [announcementId, fetchAnnouncement]);
    
    return {
        announcement,
        loading,
        error,
        refetch,
        fetchAnnouncement
    };
};