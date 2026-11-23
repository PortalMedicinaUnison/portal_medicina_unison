import { useState, useCallback } from 'react';
import { setUserRoleRequest, updateUserRequest } from '../../../../services/userService';


export default function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const updateUser = useCallback(async (id, formData) => {  
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // El rol se cambia en su propio endpoint (solo super administradores).
      const { is_admin: isAdmin, ...profile } = formData;
      if (isAdmin !== undefined) await setUserRoleRequest(id, isAdmin);
      if (Object.keys(profile).length) await updateUserRequest(id, profile);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error updating user');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { updateUser, loading, error, success, reset };
}