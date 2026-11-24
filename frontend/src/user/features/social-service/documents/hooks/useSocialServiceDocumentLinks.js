import { useCallback, useState } from 'react';
import { getSocialServiceDocumentFileRequest } from '../../../../../services/socialServiceService';
import { getBlobErrorMessage } from '../../../../../utils/errors';

const PDF_MEDIA_TYPE = 'application/pdf';
// Tiempo antes de liberar el Blob: suficiente para que la pestaña o la descarga terminen de leerlo.
const REVOKE_DELAY_MS = 60_000;

const createPdfUrl = (data) => {
  const blob = data instanceof Blob && data.type === PDF_MEDIA_TYPE
    ? data
    : new Blob([data], { type: PDF_MEDIA_TYPE });
  const url = URL.createObjectURL(blob);
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  return url;
};

const downloadName = (doc) => {
  const name = doc.original_filename?.trim();
  if (!name) return `documento_${doc.document_id}.pdf`;
  return /\.pdf$/i.test(name) ? name : `${name}.pdf`;
};


/**
 * Ver y descargar los PDF del servicio social. El archivo requiere el token, así que se pide como Blob.
 * Las funciones reciben el documento completo ({ document_id, original_filename, ... }).
 */
export default function useSocialServiceDocumentLinks(socialServiceId) {
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const openView = useCallback(async (doc) => {
    setError(null);
    // La pestaña se abre en el mismo clic, antes de cualquier await: si se abriera después
    // de la petición, el bloqueador de ventanas emergentes podría impedirlo.
    const win = window.open('', '_blank');
    if (!win) {
      setError('El navegador bloqueó la pestaña nueva. Permite las ventanas emergentes para este sitio o descarga el documento.');
      return;
    }
    try {
      win.opener = null;
      win.document.title = 'Cargando documento…';
      win.document.body?.append('Cargando documento…');
    } catch {
      // Solo es un aviso visual mientras llega el archivo; si el navegador no lo permite se continúa.
    }

    try {
      const response = await getSocialServiceDocumentFileRequest(socialServiceId, doc.document_id);
      if (!win.closed) win.location.href = createPdfUrl(response.data);
    } catch (err) {
      win.close();
      setError(await getBlobErrorMessage(err, 'No se pudo abrir el documento.'));
    }
  }, [socialServiceId]);

  const openDownload = useCallback(async (doc) => {
    setError(null);
    try {
      const response = await getSocialServiceDocumentFileRequest(socialServiceId, doc.document_id, { download: true });
      const link = document.createElement('a');
      link.href = createPdfUrl(response.data);
      link.download = downloadName(doc);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(await getBlobErrorMessage(err, 'No se pudo descargar el documento.'));
    }
  }, [socialServiceId]);

  return { openView, openDownload, error, clearError };
}
