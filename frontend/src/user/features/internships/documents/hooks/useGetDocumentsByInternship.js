import { useState, useEffect, useCallback } from 'react';
import { getDocumentsByInternshipRequest } from '../../../../../services/internshipService'
import { getErrorMessage } from '../../../../../utils/errors';


export default function useGetDocumentsByInternship(internshipId) {
  const [documents, setDocuments] = useState([]);
  // Con un id se empieza cargando: así no se muestra "no hay documentos" antes de la primera petición.
  const [loading, setLoading]     = useState(Boolean(internshipId));
  const [error, setError]         = useState(null);

  const getDocuments = useCallback(async () => {
    if (!internshipId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getDocumentsByInternshipRequest(internshipId);
      setDocuments(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar tus documentos.'));
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [internshipId]);

  // Única carga automática; después de subir o eliminar se llama a `refetch`.
  useEffect(() => {
    if (!internshipId) {
      setDocuments([]);
      setError(null);
      setLoading(false);
      return;
    }
    getDocuments();
  }, [internshipId, getDocuments]);

  return { documents, loading, error, refetch: getDocuments };
}
