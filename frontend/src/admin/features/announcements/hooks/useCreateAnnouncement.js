import { useState } from 'react';
import { cleanFormData } from '../../../../utils/utils';
import { createAnnouncementRequest } from '../../../../services/announcementService';

export default function useCreateAnnouncement() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);    

    const createAnnouncement = async (formData) => {
        setLoading(true);
        setError(null);

        const cleanedData = cleanFormData(formData);

        try {
            await createAnnouncementRequest(cleanedData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error creating announcement');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createAnnouncement, loading, error, success };
}
