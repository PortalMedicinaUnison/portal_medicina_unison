import { useState, useEffect, useCallback } from 'react';
import { getDocumentsBySocialServiceRequest } from '../../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useGetDocumentsBySocialService(socialServiceId) {
  const [documents, setDocuments] = useState([]);
  // Con un id se empieza cargando: así no se muestra "no hay documentos" antes de la primera petición.
  const [loading, setLoading]     = useState(Boolean(socialServiceId));
  const [error, setError]         = useState(null);

  const getDocuments = useCallback(async () => {
    if (!socialServiceId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getDocumentsBySocialServiceRequest(socialServiceId);
      setDocuments(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar tus documentos.'));
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [socialServiceId]);

  // Única carga automática; después de subir o eliminar se llama a `refetch`.
  useEffect(() => {
    if (!socialServiceId) {
      setDocuments([]);
      setError(null);
      setLoading(false);
      return;
    }
    getDocuments();
  }, [socialServiceId, getDocuments]);

  return { documents, loading, error, refetch: getDocuments };
}
