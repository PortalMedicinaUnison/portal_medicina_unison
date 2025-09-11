import { useState } from 'react';
import { createAnnouncementRequest } from '../../../../services/announcementService';

export default function useCreateAnnouncement() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createAnnouncement = async (announcementData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await createAnnouncementRequest(announcementData);
            console.log('Announcement created:', response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al crear el anuncio');
            console.error('Error creating announcement:', err);
            throw err; // Re-throw the error for further handling if needed
        } finally {
            setLoading(false);
        }
    };

    return {
        createAnnouncement,
        loading,
        error,
    };
}
