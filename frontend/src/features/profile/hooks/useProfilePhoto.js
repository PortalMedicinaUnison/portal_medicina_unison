import { useState, useCallback } from 'react';
import { deleteMyPhotoRequest, uploadMyPhotoRequest } from '../../../services/userService';
import { getErrorMessage } from '../../../utils/errors';

// Subir o quitar la foto de perfil del usuario en sesión. Las acciones devuelven true si salieron bien.
export default function useProfilePhoto() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = useCallback(async (request, fallback) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    try {
      await request();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, fallback));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const uploadPhoto = useCallback(
    (file) => run(() => uploadMyPhotoRequest(file), 'No se pudo subir la foto.'),
    [run]
  );
  const deletePhoto = useCallback(
    () => run(() => deleteMyPhotoRequest(), 'No se pudo quitar la foto.'),
    [run]
  );
  const reset = useCallback(() => setError(null), []);

  return { uploadPhoto, deletePhoto, loading, error, reset };
}
