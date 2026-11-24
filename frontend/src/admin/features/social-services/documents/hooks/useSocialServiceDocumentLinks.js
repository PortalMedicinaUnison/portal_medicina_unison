import { useState, useCallback } from 'react';
import { getSocialServiceDocumentFileRequest } from '../../../../../services/socialServiceService';
import { getBlobErrorMessage } from '../../../../../utils/errors';


const REVOKE_URL_AFTER_MS = 60_000;


// El archivo requiere el token, así que se descarga como Blob y se abre desde una URL local.
export default function useSocialServiceDocumentLinks(socialServiceId) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const openView = useCallback(async (docId) => {
    setError(null);
    // La pestaña se abre antes del await: si se abre después, el bloqueador de ventanas emergentes la impide.
    const tab = window.open('', '_blank');
    if (!tab) {
      setError('El navegador bloqueó la ventana emergente. Permítela para ver el documento.');
      return;
    }
    tab.opener = null;
    if (tab.document?.body) tab.document.body.textContent = 'Cargando documento…';

    setLoading(true);
    try {
      const response = await getSocialServiceDocumentFileRequest(socialServiceId, docId);
      const blobUrl = URL.createObjectURL(response.data);
      if (tab.closed) {
        URL.revokeObjectURL(blobUrl);
        return;
      }
      tab.location.href = blobUrl;
      setTimeout(() => URL.revokeObjectURL(blobUrl), REVOKE_URL_AFTER_MS);
    } catch (err) {
      tab.close();
      setError(await getBlobErrorMessage(err, 'No se pudo abrir el documento.'));
    } finally {
      setLoading(false);
    }
  }, [socialServiceId]);

  const openDownload = useCallback(async (docId, filename) => {
    setError(null);
    setLoading(true);
    try {
      const response = await getSocialServiceDocumentFileRequest(socialServiceId, docId, { download: true });
      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || `documento_${docId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), REVOKE_URL_AFTER_MS);
    } catch (err) {
      setError(await getBlobErrorMessage(err, 'No se pudo descargar el documento.'));
    } finally {
      setLoading(false);
    }
  }, [socialServiceId]);

  const reset = useCallback(() => setError(null), []);

  return { openView, openDownload, loading, error, reset };
}
