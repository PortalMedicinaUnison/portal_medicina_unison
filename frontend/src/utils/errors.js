/**
 * Mensaje legible a partir de un error de axios.
 * El backend responde {"detail": "<mensaje>"}; si por algo llega otra forma
 * (lista de errores, HTML de un proxy, sin conexión) se usa un texto genérico.
 */
export function getErrorMessage(err, fallback = 'Ocurrió un error. Intenta de nuevo.') {
  const detail = err?.response?.data?.detail;
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => item?.msg).filter(Boolean);
    if (messages.length) return messages.join(' ');
  }
  if (err?.response?.status >= 500) return 'Error del servidor. Intenta más tarde.';
  if (err?.request && !err?.response) return 'No se pudo conectar con el servidor. Revisa tu conexión.';
  return fallback;
}

/**
 * Igual que getErrorMessage, para peticiones con responseType 'blob' (descarga de archivos):
 * ahí el cuerpo del error ({"detail": "..."}) también llega como Blob y hay que leerlo.
 */
export async function getBlobErrorMessage(err, fallback = 'No se pudo obtener el archivo.') {
  const data = err?.response?.data;
  if (data instanceof Blob) {
    try {
      const detail = JSON.parse(await data.text())?.detail;
      if (typeof detail === 'string' && detail.trim()) return detail;
    } catch {
      // El cuerpo no es JSON: se usa el mensaje genérico.
    }
  }
  return getErrorMessage(err, fallback);
}
