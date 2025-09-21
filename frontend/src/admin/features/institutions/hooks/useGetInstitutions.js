import { useState, useEffect } from 'react';
import { getAllInstitutionsRequest } from '../../../../services/siteService'; 

const useGetInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInstitutions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllInstitutionsRequest();
      setInstitutions(response.data);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError(err?.message);
      return false;
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
