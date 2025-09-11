import { useState, useEffect } from 'react';
import api from '../../../../api';

const useGetAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchAnnouncements = async () => {
        setLoading(true);
        setError(null);
        
        try {
        const response = await api.get('/announcements/');
        setAnnouncements(response.data);
        } catch (err) {
        setError(err.message);
        console.error('Error fetching announcements:', err);
        } finally {
        setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAnnouncements();
    }, []);
    
    return { announcements, loading, error, refetch: fetchAnnouncements };
}
export default useGetAnnouncements;
