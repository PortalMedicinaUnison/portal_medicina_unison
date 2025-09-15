import { useState, useEffect } from 'react';
import api from '../../../../api';

const useGetSurveys = () => {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchSurveys = async () => {
        setLoading(true);
        setError(null);
        
        try {
        const response = await api.get('/surveys/');
            setSurveys(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching surveys:', err);
        } finally {
        setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSurveys();
    }, []);
    
    return { surveys, loading, error, refetch: fetchSurveys };
}
export default useGetSurveys;
