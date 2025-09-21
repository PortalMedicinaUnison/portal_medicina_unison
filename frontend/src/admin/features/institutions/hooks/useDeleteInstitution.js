import { useState } from 'react';
import { deleteInstitutionRequest } from '../../../../services/siteService'; 

export default function useDeleteInstitution() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const deleteInstitution = async (id) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await deleteInstitutionRequest(id);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Delete institution failed', err);
      setError(err?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setSuccess(false);
    setError('');
  };

  return { deleteInstitution, loading, success, error, reset };
}
