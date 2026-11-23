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
