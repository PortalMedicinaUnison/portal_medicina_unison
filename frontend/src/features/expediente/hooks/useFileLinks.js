import { useCallback, useState } from 'react';
import { getBlobErrorMessage } from '../../../utils/errors';

// Tiempo antes de liberar el Blob: suficiente para que la pestaña o la descarga terminen de leerlo.
const REVOKE_DELAY_MS = 60_000;

const createObjectUrl = (data, type) => {
  const blob = data instanceof Blob && (!type || data.type === type) ? data : new Blob([data], type ? { type } : {});
  const url = URL.createObjectURL(blob);
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  return url;
};

/**
 * Ver y descargar archivos protegidos: requieren el token, así que se piden como Blob.
 * `fetcher` es una función que devuelve la respuesta de axios (responseType: 'blob').
 */
export default function useFileLinks() {
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const openView = useCallback(async (fetcher) => {
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
      const response = await fetcher();
      if (!win.closed) win.location.href = createObjectUrl(response.data, response.data?.type || 'application/pdf');
    } catch (err) {
      win.close();
      setError(await getBlobErrorMessage(err, 'No se pudo abrir el documento.'));
    }
  }, []);

  const openDownload = useCallback(async (fetcher, filename) => {
    setError(null);
    try {
      const response = await fetcher();
      const link = document.createElement('a');
      link.href = createObjectUrl(response.data);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(await getBlobErrorMessage(err, 'No se pudo descargar el archivo.'));
    }
  }, []);

  return { openView, openDownload, error, clearError };
}
