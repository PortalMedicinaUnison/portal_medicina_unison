import { useState, useEffect } from 'react';
import api from '../../../../api';

const useGetInternships = (studentId) => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInternships = async () => {
    if (!studentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar endpoint específico para obtener pasantías del estudiante
      // Por ahora, simulamos datos para desarrollo
      // const response = await api.get('/internships', { params: { student_id: studentId } });
      
      // Datos de ejemplo para desarrollo
      const mockInternships = [
        { 
          internship_id: 1, 
          site_id: 1, 
          student_id: studentId,
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          status: 'active'
        },
        { 
          internship_id: 2, 
          site_id: 2, 
          student_id: studentId,
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          status: 'active'
        }
      ];
      
      // Simular respuesta de API
      setInternships(mockInternships);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchInternships();
    }
  }, [studentId]);

  return { internships, loading, error, refetch: fetchInternships };
};

export default useGetInternships;
