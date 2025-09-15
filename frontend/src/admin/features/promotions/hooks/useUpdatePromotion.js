import { useState } from 'react';
import { cleanFormData } from '../../../../utils/utils';
import { updatePromotionRequest } from '../../../../services/promotionService';

export default function usePromotionUpdate() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updatePromotion = async (formData, promotionId) => {  
    const cleanedData = cleanFormData(formData);
    
    setError('');
    
    const promotion = {
        year: cleanedData.year,
        period: cleanedData.period,
        is_finished: cleanedData.is_finished,
    };

    try {
      await updatePromotionRequest(promotionId, promotion);
      console.log('Promotion updated successfully');
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Update failed", err);
      setError('Error al actualizar la promoción. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { updatePromotion, error, success };
}
