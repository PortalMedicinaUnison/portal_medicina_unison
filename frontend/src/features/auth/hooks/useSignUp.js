import { useState, useCallback } from 'react';
import { cleanFormData } from '../../../utils/utils';
import { createUserRequest } from '../../../services/userService';


export default function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const signUpUser = useCallback(async (formData) => {
    if (loading) return false;
    setLoading(true);
    setError(null);
    setSuccess(false);    

    try {
      const response = await createUserRequest(formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error registering user');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { signUpUser, loading, error, success, reset };
}