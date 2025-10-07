import { useState, useEffect, useCallback } from 'react';
import { getDocumentsByInternshipRequest } from '../../../../../services/internshipService'


export default function useGetDocumentsByInternship (id) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const getDocuments = useCallback(async (internshipId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDocumentsByInternshipRequest(internshipId);
      setDocuments(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);
    
  useEffect(() => {
    getDocuments(id);
  }, [id, getDocuments]);
    
  return { documents, loading, error, refetch: getDocuments };
};