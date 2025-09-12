import { useState, useEffect } from 'react';
import { getAnnouncementByIdRequest } from '../../../../services/announcementService';

export const useAnnouncement = (announcementId) => {
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAnnouncementById = async (id) => {
        if (!id || isNaN(parseInt(id))) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getAnnouncementByIdRequest(id);
            setAnnouncement(response.data);
            console.log('Announcement fetched:', response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar el anuncio');
            console.error('Error fetching announcement:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (announcementId) {
            getAnnouncementById(announcementId);
        }
    }, [announcementId]);

    // Función para refrescar los datos
    const refetch = () => {
        if (announcementId) {
            getAnnouncementById(announcementId);
        }
    };

    return {
        announcement,
        loading,
        error,
        refetch,
        getAnnouncementById
    };
};
