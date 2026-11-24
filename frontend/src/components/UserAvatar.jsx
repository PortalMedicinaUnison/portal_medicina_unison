import { useEffect, useState } from 'react';
import { getUserPhotoRequest } from '../services/userService';

const DEFAULT_AVATAR = '/default-avatar.png';

/**
 * Foto de perfil de un usuario. La foto requiere el token, así que se descarga como Blob
 * y se muestra con una URL local; si no hay foto (o falla) se usa la imagen por defecto.
 * Se vuelve a descargar cuando cambian has_photo o updated_at (p. ej. al subir una nueva).
 */
function UserAvatar({ user, className = 'size-10 rounded-full', alt = 'Foto de perfil' }) {
  const [src, setSrc] = useState(null);
  const userId = user?.user_id;
  const hasPhoto = Boolean(user?.has_photo);
  const version = user?.updated_at;

  useEffect(() => {
    if (!userId || !hasPhoto) {
      setSrc(null);
      return undefined;
    }
    let objectUrl = null;
    let cancelled = false;
    getUserPhotoRequest(userId)
      .then(({ data }) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(data);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userId, hasPhoto, version]);

  return (
    <img
      src={src || DEFAULT_AVATAR}
      alt={alt}
      className={`object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = DEFAULT_AVATAR;
      }}
    />
  );
}

export default UserAvatar;
