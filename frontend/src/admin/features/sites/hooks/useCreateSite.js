import { useState } from 'react';
import { isValidEmail, validatePassword, isValidAcademicId} from '../../../../utils/validations';
import { cleanFormData } from '../../../../utils/utils';
import { createSiteRequest } from '../../../../services/siteService';

export default function useCreateSite() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createSite = async (formData) => {  
    const cleanedData = cleanFormData(formData);
    
    if (!isValidEmail(cleanedData.email)) {
      setError('El formato del correo es inválido.');
      return false;
    }
    
    setError('');
    
    const site = {
      institution_id: cleanedData.institutionId,
      name: cleanedData.name,
      address: cleanedData.address,
      city: cleanedData.city,
      capacity: cleanedData.capacity,
      teaching_head_name: cleanedData.teachingHeadName,
      teaching_head_email: cleanedData.teachingHeadEmail,
      teaching_head_phone: cleanedData.teachingHeadPhone,
      teaching_deputy_name: cleanedData.teachingDeputyName,
      teaching_deputy_email: cleanedData.teachingDeputyEmail,
      teaching_deputy_phone: cleanedData.teachingDeputyPhone,
      is_available: true,
    };

    try {
      await createSiteRequest(site);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Register failed", err);
      setError('Error al registrar la sede. Por favor, intenta nuevamente.');
      return false;
    }
  };

  return { createSite, error, success };
}
