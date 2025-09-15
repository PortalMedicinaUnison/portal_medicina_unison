import { useState } from 'react';
import { cleanFormData } from '../../../../../utils/utils';
import { createPsdRequest } from '../../../../../services/promotionService';

export default function useCreatePsd() {
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const createPsd = async (formData) => {  
    const cleanedData = cleanFormData(formData);
    setError('');
    setSuccess(false);
    
    const psd = {
      promotion_id: cleanedData.promotion_id,
      site_id: cleanedData.site_id,
      capacity: cleanedData.capacity,
    };

    try {
      await createPsdRequest(psd);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Register failed", err);
      setError('Error al añadir la sede. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { createPsd, error, success };
}
