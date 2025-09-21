import { useState } from 'react';
import { cleanFormData } from '../../../../../utils/utils';
import { createUserEnrollmentRequest } from '../../../../../services/userService';

export default function useCreateEnrollment() {
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const createEnrollment = async (formData) => {  
    const cleanedData = cleanFormData(formData);
    setError('');
    setSuccess(false);
    
    const payload = {
      academic_id: cleanedData.academic_id,
      is_enrolled: cleanedData.is_enrolled,
    };

    try {
      await createUserEnrollmentRequest(payload);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Register failed", err);
      setError('Error al dar de alta al alumno. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { createEnrollment, error, success };
}