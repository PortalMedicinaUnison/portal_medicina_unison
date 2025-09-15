import { useState } from 'react';
import { cleanFormData } from '../../../../../utils/utils';
import { createUserEnrollmentRequest } from '../../../../../services/userService';

export default function useCreateUserEnrollment() {
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const createUserEnrollment = async (formData) => {  
    const cleanedData = cleanFormData(formData);
    setError('');
    setSuccess(false);
    
    const payload = {
      student_id: cleanedData.student_id,
      is_accepted: cleanedData.is_accepted,
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

  return { createUserEnrollment, error, success };
}