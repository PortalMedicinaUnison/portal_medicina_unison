import { useState } from 'react';
import { cleanFormData } from '../../../../utils/utils';
import { createEnrollmentRequest } from '../../../../services/internshipService';

export default function useCreateEnrollment() {
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const createEnrollment = async (formData) => {  
    const cleanedData = cleanFormData(formData);
    setError('');
    setSuccess(false);
    
    const payload = {
      student_id: cleanedData.student_id,
      is_accepted: cleanedData.is_accepted,
    };

    try {
      await createEnrollmentRequest(payload);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Register failed", err);
      setError('Error al pre-registrar al alumno. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { createEnrollment, error, success };
}