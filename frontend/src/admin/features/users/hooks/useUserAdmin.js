import { useState, useEffect, useCallback } from 'react';
import { getUserByIdRequest } from '../../../../services/userService';


export default function useUserAdmin(userId) {
  const [user, setUserAdmin]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const getUserAdmin = useCallback(async (userId) => {
    if (!userId) return Promise.resolve();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserByIdRequest(userId);
      setUserAdmin(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching user');
      setUserAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setUserAdmin(null);
      setError(null);
      setLoading(false);
      return;
    }
    getUserAdmin(userId);
  }, [userId, getUserAdmin]);

  const refetch = useCallback(() => {
    if (!userId) return Promise.resolve();
    return getUserAdmin(userId);
  }, [userId, getUserAdmin]);

  return { user, loading, error, refetch, getUserAdmin };
};