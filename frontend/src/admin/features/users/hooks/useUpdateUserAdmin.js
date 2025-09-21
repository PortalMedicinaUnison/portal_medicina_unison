import { useState } from 'react';
import { updateUserRequest } from '../../../../services/userService';

export default function useUserUpdateAdmin() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateUserAdmin = async (userId, formData) => {      
    setError('');

    console.log('Updating user with data:', formData);

    try {
      await updateUserRequest(userId, formData);
      console.log('User updated successfully');
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Update failed", err);
      setError('Error al cambiar el rol del usuario. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { updateUserAdmin, error, success };
}
