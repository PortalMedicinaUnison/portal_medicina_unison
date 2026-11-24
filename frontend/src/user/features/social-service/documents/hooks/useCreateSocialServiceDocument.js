import { useState, useCallback } from 'react';
import { createSocialServiceDocumentRequest } from '../../../../../services/socialServiceService';
import { getErrorMessage } from '../../../../../utils/errors';


export default function useCreateSocialServiceDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  // Devuelve la respuesta si se guardó o null si falló (el mensaje queda en `error`).
  const createDocument = useCallback(async (socialServiceId, payload) => {
    if (loading) return null;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createSocialServiceDocumentRequest(socialServiceId, payload);
      setSuccess(true);
      return response;
    } catch (err) {
      // El backend explica el motivo (409 ya existe, 413 muy grande, 400 no es PDF). Un 413 de un
      // proxy llega sin `detail`, por eso tiene su propio mensaje de respaldo.
      const fallback = err?.response?.status === 413
        ? 'El archivo supera el tamaño máximo permitido.'
        : 'No se pudo subir el documento.';
      setError(getErrorMessage(err, fallback));
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { createDocument, loading, error, success, reset };
}
