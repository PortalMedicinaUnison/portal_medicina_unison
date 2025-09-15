import { useState, useEffect } from 'react';
import api from '../../../../api';

const useGetSites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSites = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar endpoint correcto o verificar permisos
      // Por ahora, simulamos datos para desarrollo
      // const response = await api.get('/sites');
      
      // Datos de ejemplo para desarrollo
      const mockSites = [
        { 
          site_id: 1, 
          name: 'Hospital General',
          city: 'Hermosillo',
          institution_id: 1
        },
        { 
          site_id: 2, 
          name: 'Clínica ISSSTE',
          city: 'Hermosillo',
          institution_id: 2
        },
        { 
          site_id: 3, 
          name: 'Hospital Infantil',
          city: 'Hermosillo',
          institution_id: 1
        }
      ];
      
      // Simular respuesta de API
      setSites(mockSites);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return { sites, loading, error, refetch: fetchSites };
};

export default useGetSites;
