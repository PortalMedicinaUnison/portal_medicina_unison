import { useState, useCallback, useEffect } from 'react';
import {
  confirmPasswordResetRequest,
  getPasswordResetOptionsRequest,
  requestPasswordResetRequest,
  verifyPasswordResetRequest,
} from '../../../services/authService';
import { getErrorMessage } from '../../../utils/errors';


// "¿Olvidaste tu contraseña?": consulta si el correo está configurado y pide el enlace.
export function useForgotPassword() {
  const [options, setOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    getPasswordResetOptionsRequest()
      .then(({ data }) => { if (active) setOptions(data); })
      // Si no se puede consultar, se muestra la opción que siempre funciona: pedirlo a la coordinación.
      .catch(() => { if (active) setOptions({ email_enabled: false }); })
      .finally(() => { if (active) setLoadingOptions(false); });
    return () => { active = false; };
  }, []);

  const requestReset = useCallback(async (email) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await requestPasswordResetRequest(email);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo enviar el enlace. Intenta de nuevo.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { options, loadingOptions, requestReset, loading, error, success, reset };
}


// Página del enlace: comprueba el token y guarda la nueva contraseña.
export function useResetPassword(token) {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [verifying, setVerifying] = useState(Boolean(token));
  const [tokenError, setTokenError] = useState(
    token ? null : 'El enlace para restablecer la contraseña no es válido.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    verifyPasswordResetRequest(token)
      .then(({ data }) => { if (active) setTokenInfo(data); })
      .catch((err) => {
        if (active) setTokenError(getErrorMessage(err, 'No se pudo comprobar el enlace. Intenta de nuevo.'));
      })
      .finally(() => { if (active) setVerifying(false); });
    return () => { active = false; };
  }, [token]);

  const confirmReset = useCallback(async ({ newPassword, confirmPassword }) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await confirmPasswordResetRequest({ token, new_password: newPassword, confirm_password: confirmPassword });
      setSuccess(true);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cambiar la contraseña.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading, token]);

  const reset = useCallback(() => setError(null), []);

  return { tokenInfo, verifying, tokenError, confirmReset, loading, error, success, reset };
}
