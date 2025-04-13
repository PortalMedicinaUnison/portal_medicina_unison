import { useState } from 'react';
import api from '../../../api';
import { isValidEmail, validatePassword } from '../../../utils/validations';
import { cleanFormData } from '../../../utils/utils';
import { DEFAULT_PROFILE_IMAGE } from '../../../config';

export default function useUserUpdate() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateUser = async (formData, userId) => {  
    const cleanedData = cleanFormData(formData);

    if (!isValidEmail(cleanedData.email)) {
      setError('El formato del correo es inválido.');
      return false;
    }

    const { valid, error: passwordError } = validatePassword(cleanedData.password);
    if (!valid) {
      setError(passwordError);
      return false;
    }
    
    setError('');
    
    const user = {
      first_name: cleanedData.firstName,
      last_name: cleanedData.lastName,
      second_last_name: cleanedData.secondLastName,
      email: cleanedData.email,
      profile_photo: DEFAULT_PROFILE_IMAGE,
      is_admin: false,
      is_super_admin: false,
    };

    try {
      await api.put(`/users/${userId}/`, user);
      console.log('User updated successfully');
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Update failed", err);
      setError('Error al actualizar el usuario. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { updateUser, error, success };
}
