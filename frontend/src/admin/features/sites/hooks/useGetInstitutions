import { useState, useEffect } from 'react';
import api from '../../../../api';


const useGetInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInstitutions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/institutions');
      setInstitutions(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return { institutions, loading, error, refetch: fetchInstitutions };
};

export default useGetInstitutions;