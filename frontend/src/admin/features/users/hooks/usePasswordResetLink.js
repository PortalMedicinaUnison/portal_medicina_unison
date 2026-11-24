import { useState, useCallback } from 'react';
import { ROUTES } from '../../../../config';
import { createPasswordResetLinkRequest } from '../../../../services/userService';
import { getErrorMessage } from '../../../../utils/errors';


// La coordinación genera un enlace de un solo uso para que el usuario cree una contraseña nueva.
export default function usePasswordResetLink() {
  const [link, setLink] = useState(null);       // { url, expiresAt }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLink = useCallback(async (userId) => {
    if (loading) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await createPasswordResetLinkRequest(userId);
      // Se arma con el origen actual: es la misma dirección del portal que usa la coordinación.
      const url = `${window.location.origin}${ROUTES.AUTH.RESET_PASSWORD}?token=${encodeURIComponent(data.token)}`;
      const result = { url, expiresAt: data.expires_at };
      setLink(result);
      return result;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo generar el enlace.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLink(null);
    setError(null);
    setLoading(false);
  }, []);

  return { link, createLink, loading, error, reset };
}
