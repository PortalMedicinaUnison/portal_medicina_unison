import { useRef, useState } from 'react';
import UserAvatar from '../../../components/UserAvatar';
import { useUser } from '../../../contexts/UserContext';
import useProfilePhoto from '../hooks/useProfilePhoto';

// Mismos límites que el backend (MAX_PHOTO_MB y tipos aceptados).
const MAX_PHOTO_MB = 2;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Va dentro del formulario de perfil: los botones son type="button" para no enviarlo.
function ProfilePhotoEditor({ user }) {
  const inputRef = useRef(null);
  const { reload } = useUser();
  const { uploadPhoto, deletePhoto, loading, error, reset } = useProfilePhoto();
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState('');

// ---------------------- HANDLERS ----------------------

  const clearMessages = () => {
    reset();
    setLocalError('');
    setMessage('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    clearMessages();
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('La foto debe ser una imagen JPEG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setLocalError(`La foto no puede pesar más de ${MAX_PHOTO_MB} MB.`);
      return;
    }
    if (await uploadPhoto(file)) {
      await reload();
      setMessage('Foto actualizada.');
    }
  };

  const handleDelete = async () => {
    clearMessages();
    if (await deletePhoto()) {
      await reload();
      setMessage('Foto eliminada.');
    }
  };

// ---------------------- RENDER ----------------------

  return (
    <div className="user-info-photo flex flex-col items-center gap-3">
      <UserAvatar user={user} className="user-profile-photo" />
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          {loading ? 'Guardando...' : (user?.has_photo ? 'Cambiar foto' : 'Subir foto')}
        </button>
        {user?.has_photo && (
          <button type="button" className="btn-tertiary" onClick={handleDelete} disabled={loading}>
            Quitar foto
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Elegir foto de perfil"
      />
      <p className="text-xs text-gray-500">JPEG, PNG o WebP · máximo {MAX_PHOTO_MB} MB</p>
      {(localError || error) && <p className="text-sm text-red-600" role="alert">{localError || error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}
    </div>
  );
}

export default ProfilePhotoEditor;
