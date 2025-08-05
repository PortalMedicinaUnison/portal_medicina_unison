import { useState } from 'react';
import { cleanFormData } from '../../../../utils/utils';
import { createInstitutionRequest } from '../../../../services/siteService';

export default function useCreateInstitution() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createInstitution = async (formData) => {  
    const cleanedData = cleanFormData(formData);
    
    setError('');
    
    const instituion = {
      name: cleanedData.name,
    };

    try {
      await createInstitutionRequest(instituion);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Register failed", err);
      setError('Error al registrar la institución. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { createInstitution, error, success };
}
