import { useState, useEffect, useCallback } from 'react';
import { getDocumentsByInternshipRequest } from '../../../../../services/internshipService'


export default function useGetDocuments () {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const getDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDocumentsByInternshipRequest();
      setDocuments(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getDocuments();
  }, [getDocuments]);
    
  return { documents, loading, error, refetch: getDocuments };
};