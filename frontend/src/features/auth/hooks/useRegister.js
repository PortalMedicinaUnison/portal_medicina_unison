import { useState } from 'react';
import api from '../../../api';
import { isValidEmail, validatePassword, isValidAcademicId} from '../../../utils/validations';
import { cleanFormData } from '../../../utils/utils';
import { DEFAULT_PROFILE_IMAGE } from '../../../config';

export default function useRegister() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const registerUser = async (formData) => {  
    if (!isValidAcademicId(formData.academicId)) {
      setError('El expediente debe ser un número de exactamente 9 dígitos.');
      return false;
    }
    if (formData.email !== formData.confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      setError('El formato del correo es inválido.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return false;
    }

    const { valid, error: passwordError } = validatePassword(formData.password);
    if (!valid) {
      setError(passwordError);
      return false;
    }
    
    setError('');
    
    const user = {
      academic_id: formData.academicId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      second_last_name: formData.secondLastName,
      email: formData.email,
      password: formData.password,
      profile_photo: DEFAULT_PROFILE_IMAGE,
      is_admin: false,
      is_super_admin: false,
    };

    try {
      await api.post('/users/', user);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Register failed", err);
      setError('Error al registrar el usuario. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { registerUser, error, success };
}
