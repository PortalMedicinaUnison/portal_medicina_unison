import { useState } from 'react';
import { cleanFormData } from '../../../../utils/utils';
import { createPromotionRequest } from '../../../../services/promotionService';

export default function useCreatePromotion() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createPromotion = async (formData) => {  
    const cleanedData = cleanFormData(formData);

    setError('');
    
    const promotion = {
      year: cleanedData.year,
      period: cleanedData.period,
      is_finished: cleanedData.is_finished,
    };

    try {
      await createPromotionRequest(promotion);
      setSuccess(true);
      return true;
    } catch (err) {
      setError('Register failed');
      return false;
    }
  };

  return { createPromotion, error, success };
}
